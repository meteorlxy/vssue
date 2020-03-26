import { VssueAPI } from 'vssue';

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { buildURL, concatURL, getCleanURL, parseQuery } from '@vssue/utils';

import {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
  normalizeReactions,
  mapReactionName,
} from './utils';

import {
  ResponseAccessToken,
  ResponseUser,
  ResponseIssue,
  ResponseComment,
  ResponseReaction,
  ResponseSearch,
} from './types';

/**
 * Github REST API v3
 *
 * @see https://developer.github.com/v3/
 * @see https://developer.github.com/apps/building-oauth-apps/
 */
export default class GithubV3 implements VssueAPI.Instance {
  baseURL: string;
  owner: string;
  repo: string;
  labels: Array<string>;
  clientId: string;
  clientSecret: string;
  state: string;
  proxy: string | ((url: string) => string);
  $http: AxiosInstance;

  constructor({
    baseURL = 'https://github.com',
    owner,
    repo,
    labels,
    clientId,
    clientSecret,
    state,
    proxy,
  }: VssueAPI.Options) {
    /* istanbul ignore if */
    if (typeof clientSecret === 'undefined' || typeof proxy === 'undefined') {
      throw new Error('clientSecret and proxy is required for GitHub V3');
    }
    this.baseURL = baseURL;
    this.owner = owner;
    this.repo = repo;
    this.labels = labels;

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.state = state;
    this.proxy = proxy;

    this.$http = axios.create({
      baseURL:
        baseURL === 'https://github.com'
          ? 'https://api.github.com'
          : concatURL(baseURL, 'api/v3'),
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    this.$http.interceptors.response.use(response => {
      if (response.data && response.data.error) {
        return Promise.reject(new Error(response.data.error_description));
      }
      return response;
    });
  }

  /**
   * The platform api info
   */
  get platform(): VssueAPI.Platform {
    return {
      name: 'GitHub',
      link: this.baseURL,
      version: 'v3',
      meta: {
        reactable: true,
        sortable: false,
      },
    };
  }

  /**
   * Redirect to the authorization page of platform.
   *
   * @see https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#1-request-a-users-github-identity
   */
  redirectAuth(): void {
    window.location.href = buildURL(
      concatURL(this.baseURL, 'login/oauth/authorize'),
      {
        client_id: this.clientId,
        redirect_uri: window.location.href,
        scope: 'public_repo',
        state: this.state,
      }
    );
  }

  /**
   * Handle authorization.
   *
   * @see https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
   *
   * @remarks
   * If the `code` and `state` exist in the query, and the `state` matches, remove them from query, and try to get the access token.
   */
  async handleAuth(): Promise<VssueAPI.AccessToken> {
    const query = parseQuery(window.location.search);
    if (query.code) {
      if (query.state !== this.state) {
        return null;
      }
      const code = query.code;
      delete query.code;
      delete query.state;
      const replaceURL =
        buildURL(getCleanURL(window.location.href), query) +
        window.location.hash;
      window.history.replaceState(null, '', replaceURL);
      const accessToken = await this.getAccessToken({ code });
      return accessToken;
    }
    return null;
  }

  /**
   * Get user access token via `code`
   *
   * @see https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#2-users-are-redirected-back-to-your-site-by-github
   */
  async getAccessToken({ code }: { code: string }): Promise<string> {
    /**
     * access_token api does not support cors
     * @see https://github.com/isaacs/github/issues/330
     */
    const originalURL = concatURL(this.baseURL, 'login/oauth/access_token');
    const proxyURL =
      typeof this.proxy === 'function' ? this.proxy(originalURL) : this.proxy;
    const { data } = await this.$http.post<ResponseAccessToken>(
      proxyURL,
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        /**
         * useless but mentioned in docs
         */
        // redirect_uri: window.location.href,
        // state: this.state,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );
    return data.access_token;
  }

  /**
   * Get the logged-in user with access token.
   *
   * @see https://developer.github.com/v3/users/#get-the-authenticated-user
   */
  async getUser({
    accessToken,
  }: {
    accessToken: VssueAPI.AccessToken;
  }): Promise<VssueAPI.User> {
    const { data } = await this.$http.get<ResponseUser>('user', {
      headers: { Authorization: `token ${accessToken}` },
    });
    return normalizeUser(data);
  }

  /**
   * Get issue of this page according to the issue id or the issue title
   *
   * @see https://developer.github.com/v3/issues/#list-issues-for-a-repository
   * @see https://developer.github.com/v3/issues/#get-a-single-issue
   * @see https://developer.github.com/v3/#pagination
   * @see https://developer.github.com/v3/search/#search-issues-and-pull-requests
   */
  async getIssue({
    accessToken,
    issueId,
    issueTitle,
  }: {
    accessToken: VssueAPI.AccessToken;
    issueId?: string | number;
    issueTitle?: string;
  }): Promise<VssueAPI.Issue | null> {
    const options: AxiosRequestConfig = {};

    if (accessToken) {
      options.headers = {
        Authorization: `token ${accessToken}`,
      };
    }

    if (issueId) {
      try {
        options.params = {
          // to avoid caching
          timestamp: Date.now(),
        };
        const { data } = await this.$http.get<ResponseIssue>(
          `repos/${this.owner}/${this.repo}/issues/${issueId}`,
          options
        );
        return normalizeIssue(data);
      } catch (e) {
        if (e.response && e.response.status === 404) {
          return null;
        } else {
          throw e;
        }
      }
    } else {
      options.params = {
        q: [
          `"${issueTitle}"`,
          `is:issue`,
          `in:title`,
          `repo:${this.owner}/${this.repo}`,
          `is:public`,
          ...this.labels.map(label => `label:${label}`),
        ].join(' '),
      };
      const { data } = await this.$http.get<ResponseSearch<ResponseIssue>>(
        `search/issues`,
        options
      );
      const issue = data.items
        .map(normalizeIssue)
        .find(item => item.title === issueTitle);
      return issue || null;
    }
  }

  /**
   * Create a new issue
   *
   * @see https://developer.github.com/v3/issues/#create-an-issue
   */
  async postIssue({
    accessToken,
    title,
    content,
  }: {
    accessToken: VssueAPI.AccessToken;
    title: string;
    content: string;
  }): Promise<VssueAPI.Issue> {
    const { data } = await this.$http.post<ResponseIssue>(
      `repos/${this.owner}/${this.repo}/issues`,
      {
        title,
        body: content,
        labels: this.labels,
      },
      {
        headers: { Authorization: `token ${accessToken}` },
      }
    );
    return normalizeIssue(data);
  }

  /**
   * Get comments of this page according to the issue id
   *
   * @see https://developer.github.com/v3/issues/comments/#list-comments-on-an-issue
   * @see https://developer.github.com/v3/#pagination
   *
   * @remarks
   * Github V3 does not support sort for issue comments now.
   * Github V3 have to request the parent issue to get the count of comments.
   */
  async getComments({
    accessToken,
    issueId,
    query: { page = 1, perPage = 10 /*, sort = 'desc' */ } = {},
  }: {
    accessToken: VssueAPI.AccessToken;
    issueId: string | number;
    query?: Partial<VssueAPI.Query>;
  }): Promise<VssueAPI.Comments> {
    const issueOptions: AxiosRequestConfig = {
      params: {
        // to avoid caching
        timestamp: Date.now(),
      },
    };
    const commentsOptions: AxiosRequestConfig = {
      params: {
        // pagination
        page: page,
        per_page: perPage,
        /**
         * github v3 api does not support sort for issue comments
         * have sent feedback to github support
         */
        // 'sort': 'created',
        // 'direction': sort,
        // to avoid caching
        timestamp: Date.now(),
      },
      headers: {
        Accept: [
          'application/vnd.github.v3.raw+json',
          'application/vnd.github.v3.html+json',
          'application/vnd.github.squirrel-girl-preview',
        ],
      },
    };
    if (accessToken) {
      issueOptions.headers = {
        Authorization: `token ${accessToken}`,
      };
      commentsOptions.headers.Authorization = `token ${accessToken}`;
    }

    // github v3 have to get the total count of comments by requesting the issue
    const [issueRes, commentsRes] = await Promise.all([
      this.$http.get<ResponseIssue>(
        `repos/${this.owner}/${this.repo}/issues/${issueId}`,
        issueOptions
      ),
      this.$http.get<ResponseComment[]>(
        `repos/${this.owner}/${this.repo}/issues/${issueId}/comments`,
        commentsOptions
      ),
    ]);

    // it's annoying that have to get the page and per_page from the `Link` header
    const linkHeader = commentsRes.headers.link || null;

    /* istanbul ignore next */
    const thisPage = /rel="next"/.test(linkHeader)
      ? Number(linkHeader.replace(/^.*[^_]page=(\d*).*rel="next".*$/, '$1')) - 1
      : /rel="prev"/.test(linkHeader)
      ? Number(linkHeader.replace(/^.*[^_]page=(\d*).*rel="prev".*$/, '$1')) + 1
      : 1;

    /* istanbul ignore next */
    const thisPerPage = linkHeader
      ? Number(linkHeader.replace(/^.*per_page=(\d*).*$/, '$1'))
      : perPage;

    return {
      count: Number(issueRes.data.comments),
      page: thisPage,
      perPage: thisPerPage,
      data: commentsRes.data.map(normalizeComment),
    };
  }

  /**
   * Create a new comment
   *
   * @see https://developer.github.com/v3/issues/comments/#create-a-comment
   */
  async postComment({
    accessToken,
    issueId,
    content,
  }: {
    accessToken: VssueAPI.AccessToken;
    issueId: string | number;
    content: string;
  }): Promise<VssueAPI.Comment> {
    const { data } = await this.$http.post<ResponseComment>(
      `repos/${this.owner}/${this.repo}/issues/${issueId}/comments`,
      {
        body: content,
      },
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: [
            'application/vnd.github.v3.raw+json',
            'application/vnd.github.v3.html+json',
            'application/vnd.github.squirrel-girl-preview',
          ],
        },
      }
    );
    return normalizeComment(data);
  }

  /**
   * Edit a comment
   *
   * @see https://developer.github.com/v3/issues/comments/#edit-a-comment
   */
  async putComment({
    accessToken,
    commentId,
    content,
  }: {
    accessToken: VssueAPI.AccessToken;
    issueId: string | number;
    commentId: string | number;
    content: string;
  }): Promise<VssueAPI.Comment> {
    const { data } = await this.$http.patch<ResponseComment>(
      `repos/${this.owner}/${this.repo}/issues/comments/${commentId}`,
      {
        body: content,
      },
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: [
            'application/vnd.github.v3.raw+json',
            'application/vnd.github.v3.html+json',
            'application/vnd.github.squirrel-girl-preview',
          ],
        },
      }
    );
    return normalizeComment(data);
  }

  /**
   * Delete a comment
   *
   * @see https://developer.github.com/v3/issues/comments/#delete-a-comment
   */
  async deleteComment({
    accessToken,
    commentId,
  }: {
    accessToken: VssueAPI.AccessToken;
    issueId: string | number;
    commentId: string | number;
  }): Promise<boolean> {
    const { status } = await this.$http.delete(
      `repos/${this.owner}/${this.repo}/issues/comments/${commentId}`,
      {
        headers: { Authorization: `token ${accessToken}` },
      }
    );
    return status === 204;
  }

  /**
   * Get reactions of a comment
   *
   * @see https://developer.github.com/v3/issues/comments/#get-a-single-comment
   * @see https://developer.github.com/v3/reactions/#list-reactions-for-an-issue-comment
   *
   * @remarks
   * The `List reactions for an issue comment` API also returns author of each reaction.
   * As we only need the count, use the `Get a single comment` API is much simpler.
   */
  async getCommentReactions({
    accessToken,
    commentId,
  }: {
    accessToken: VssueAPI.AccessToken;
    issueId: string | number;
    commentId: string | number;
  }): Promise<VssueAPI.Reactions> {
    const { data } = await this.$http.get<ResponseComment>(
      `repos/${this.owner}/${this.repo}/issues/comments/${commentId}`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: 'application/vnd.github.squirrel-girl-preview',
        },
      }
    );
    return normalizeReactions(data.reactions);
  }

  /**
   * Create a new reaction of a comment
   *
   * @see https://developer.github.com/v3/reactions/#create-reaction-for-an-issue-comment
   */
  async postCommentReaction({
    accessToken,
    commentId,
    reaction,
  }: {
    accessToken: VssueAPI.AccessToken;
    issueId: string | number;
    commentId: string | number;
    reaction: keyof VssueAPI.Reactions;
  }): Promise<boolean> {
    const response = await this.$http.post<ResponseReaction>(
      `repos/${this.owner}/${this.repo}/issues/comments/${commentId}/reactions`,
      {
        content: mapReactionName(reaction),
      },
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: 'application/vnd.github.squirrel-girl-preview',
        },
      }
    );

    // 200 OK if the reaction is already token
    if (response.status === 200) {
      return this.deleteCommentReaction({
        accessToken,
        commentId,
        reactionId: response.data.id,
      });
    }

    // 201 CREATED
    return response.status === 201;
  }

  /**
   * Delete a reaction of a comment
   *
   * @see https://developer.github.com/v3/reactions/#delete-a-reaction
   */
  async deleteCommentReaction({
    accessToken,
    commentId,
    reactionId,
  }: {
    accessToken: VssueAPI.AccessToken;
    commentId: string | number;
    reactionId: string | number;
  }): Promise<boolean> {
    const response = await this.$http.delete(
      `repos/${this.owner}/${this.repo}/issues/comments/${commentId}/reactions/${reactionId}`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: 'application/vnd.github.squirrel-girl-preview',
        },
      }
    );
    return response.status === 204;
  }
}
