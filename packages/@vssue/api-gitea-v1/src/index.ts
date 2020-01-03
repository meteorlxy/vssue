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
  ResponseLabel,
  ResponseMarkdown,
  ResponseReaction,
} from './types';

/**
 * Gitea API V1
 *
 * @see https://docs.gitea.io/en-us/oauth2-provider/
 * @see https://docs.gitea.io/en-us/api-usage
 * @see https://gitea.com/api/swagger
 */
export default class GiteaV1 implements VssueAPI.Instance {
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
    baseURL = 'https://gitea.com',
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
      throw new Error('clientSecret and proxy is required for Gitea V1');
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
      baseURL: concatURL(baseURL, 'api/v1'),
      headers: {
        Accept: 'application/json',
      },
    });
  }

  /**
   * The platform api info
   */
  get platform(): VssueAPI.Platform {
    return {
      name: 'Gitea',
      link: this.baseURL,
      version: 'v1',
      meta: {
        reactable: true,
        sortable: false,
      },
    };
  }

  /**
   * Redirect to the authorization page of platform.
   *
   * @see https://docs.gitea.io/en-us/oauth2-provider/
   */
  redirectAuth(): void {
    window.location.href = buildURL(
      concatURL(this.baseURL, 'login/oauth/authorize'),
      {
        client_id: this.clientId,
        redirect_uri: window.location.href,
        response_type: 'code',
        state: this.state,
      }
    );
  }

  /**
   * Handle authorization.
   *
   * @see https://docs.gitea.io/en-us/oauth2-provider/
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
      // the `code` from gitea is uri encoded
      // typically includes an encoded `=` -> `%3D`
      const code = decodeURIComponent(query.code);
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
   * @see https://docs.gitea.io/en-us/oauth2-provider/
   */
  async getAccessToken({ code }: { code: string }): Promise<string> {
    const originalURL = concatURL(this.baseURL, 'login/oauth/access_token');
    const proxyURL =
      typeof this.proxy === 'function' ? this.proxy(originalURL) : this.proxy;
    const { data } = await this.$http.post<ResponseAccessToken>(proxyURL, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: window.location.href,
    });
    return data.access_token;
  }

  /**
   * Get the logged-in user with access token.
   *
   * @see https://gitea.com/api/swagger#/user/userGetCurrent
   */
  async getUser({
    accessToken,
  }: {
    accessToken: VssueAPI.AccessToken;
  }): Promise<VssueAPI.User> {
    const { data } = await this.$http.get<ResponseUser>('user', {
      headers: { Authorization: `bearer ${accessToken}` },
    });
    return normalizeUser(data, this.baseURL);
  }

  /**
   * Get issue of this page according to the issue id or the issue title
   *
   * @see https://gitea.com/api/swagger#/issue/issueListIssues
   * @see https://gitea.com/api/swagger#/issue/issueGetIssue
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
        Authorization: `bearer ${accessToken}`,
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
        return normalizeIssue(data, this.baseURL, this.owner, this.repo);
      } catch (e) {
        if (e.response && e.response.status === 404) {
          return null;
        } else {
          throw e;
        }
      }
    } else {
      /**
       * Gitea only supports using label ids to get issues
       */
      const allLabels = await this.getLabels({ accessToken });
      const labels = this.labels
        .filter(label => allLabels.find(item => item.name === label))
        .map(label => allLabels.find(item => item.name === label)!.id);

      options.params = {
        labels,
        q: issueTitle,
        // to avoid caching
        timestamp: Date.now(),
      };

      const { data } = await this.$http.get<ResponseIssue[]>(
        `repos/${this.owner}/${this.repo}/issues`,
        options
      );
      const issue = data
        .map(item => normalizeIssue(item, this.baseURL, this.owner, this.repo))
        .find(item => item.title === issueTitle);
      return issue || null;
    }
  }

  /**
   * Create a new issue
   *
   * @see https://gitea.com/api/swagger#/issue/issueCreateIssue
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
    /**
     * Gitea only supports using label ids to create issue
     */
    const labels = await Promise.all(
      this.labels.map(label =>
        this.postLabel({
          accessToken,
          label,
        })
      )
    );

    const { data } = await this.$http.post<ResponseIssue>(
      `repos/${this.owner}/${this.repo}/issues`,
      {
        title,
        body: content,
        labels,
      },
      {
        headers: { Authorization: `bearer ${accessToken}` },
      }
    );
    return normalizeIssue(data, this.baseURL, this.owner, this.repo);
  }

  /**
   * Get comments of this page according to the issue id
   *
   * @see https://gitea.com/api/swagger#/issue/issueGetComments
   */
  async getComments({
    accessToken,
    issueId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    query: { page = 1, perPage = 10, sort = 'desc' } = {},
  }: {
    accessToken: VssueAPI.AccessToken;
    issueId: string | number;
    query?: Partial<VssueAPI.Query>;
  }): Promise<VssueAPI.Comments> {
    const options: AxiosRequestConfig = {
      params: {
        // to avoid caching
        timestamp: Date.now(),
      },
    };
    if (accessToken) {
      options.headers = {
        Authorization: `bearer ${accessToken}`,
      };
    }
    const response = await this.$http.get<ResponseComment[]>(
      `repos/${this.owner}/${this.repo}/issues/${issueId}/comments`,
      options
    );
    const commentsRaw = response.data;

    // gitea api v1 should get html content and reactions by other api
    const getCommentsMeta: Array<Promise<void>> = [];

    for (const comment of commentsRaw) {
      getCommentsMeta.push(
        (async (): Promise<void> => {
          comment.body_html = await this.getMarkdownContent({
            accessToken: accessToken,
            contentRaw: comment.body,
          });
        })()
      );
      getCommentsMeta.push(
        (async (): Promise<void> => {
          comment.reactions = await this.getCommentReactions({
            accessToken: accessToken,
            issueId: issueId,
            commentId: comment.id,
          });
        })()
      );
    }

    await Promise.all(getCommentsMeta);

    return {
      count: commentsRaw.length,
      // gitea api v1 does not support pagination for now
      // so the `page` and `perPage` are fake data
      page: 1,
      perPage: 50,
      data: commentsRaw.map(item => normalizeComment(item, this.baseURL)),
    };
  }

  /**
   * Create a new comment
   *
   * @see https://gitea.com/api/swagger#/issue/issueCreateComment
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
        headers: { Authorization: `bearer ${accessToken}` },
      }
    );
    data.body_html = await this.getMarkdownContent({
      accessToken: accessToken,
      contentRaw: data.body,
    });
    return normalizeComment(data, this.baseURL);
  }

  /**
   * Edit a comment
   *
   * @see https://gitea.com/api/swagger#/issue/issueEditCommentDeprecated
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
        headers: { Authorization: `bearer ${accessToken}` },
      }
    );
    data.body_html = await this.getMarkdownContent({
      accessToken: accessToken,
      contentRaw: data.body,
    });
    return normalizeComment(data, this.baseURL);
  }

  /**
   * Delete a comment
   *
   * @see https://gitea.com/api/swagger#/issue/issueDeleteCommentDeprecated
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
        headers: { Authorization: `bearer ${accessToken}` },
      }
    );
    return status === 204;
  }

  /**
   * Get reactions of a comment
   *
   * @see https://gitea.com/api/swagger#/issue/issueGetCommentReactions
   */
  async getCommentReactions({
    accessToken,
    commentId,
  }: {
    accessToken: VssueAPI.AccessToken;
    issueId: string | number;
    commentId: string | number;
  }): Promise<VssueAPI.Reactions> {
    const options: AxiosRequestConfig = {};
    if (accessToken) {
      options.headers = {
        Authorization: `bearer ${accessToken}`,
      };
    }
    const { data } = await this.$http.get<ResponseReaction[]>(
      `repos/${this.owner}/${this.repo}/issues/comments/${commentId}/reactions`,
      options
    );
    // data is possibly be `null`
    return normalizeReactions(data || []);
  }

  /**
   * Create a new reaction of a comment
   *
   * @see https://gitea.com/api/swagger#/issue/issuePostCommentReaction
   */
  async postCommentReaction({
    commentId,
    reaction,
    accessToken,
  }: {
    accessToken: VssueAPI.AccessToken;
    issueId: string | number;
    commentId: string | number;
    reaction: keyof VssueAPI.Reactions;
  }): Promise<boolean> {
    try {
      const response = await this.$http.post(
        `repos/${this.owner}/${this.repo}/issues/comments/${commentId}/reactions`,
        {
          content: mapReactionName(reaction),
        },
        {
          headers: { Authorization: `bearer ${accessToken}` },
        }
      );
      return response.status === 201;
    } catch (e) {
      // https://github.com/go-gitea/gitea/issues/9544
      if (e.response && e.response.status === 500) {
        return this.deleteCommentReaction({
          accessToken,
          commentId,
          reaction,
        });
      } else {
        throw e;
      }
    }
  }

  /**
   * Create a new reaction of a comment
   *
   * @see https://gitea.com/api/swagger#/issue/issueDeleteCommentReaction
   */
  async deleteCommentReaction({
    commentId,
    reaction,
    accessToken,
  }: {
    accessToken: VssueAPI.AccessToken;
    commentId: string | number;
    reaction: keyof VssueAPI.Reactions;
  }): Promise<boolean> {
    const response = await this.$http.request({
      url: `repos/${this.owner}/${this.repo}/issues/comments/${commentId}/reactions`,
      method: 'delete',
      data: { content: mapReactionName(reaction) },
      headers: { Authorization: `bearer ${accessToken}` },
    });
    return response.status === 200;
  }

  /**
   * Get labels
   *
   * @see https://gitea.com/api/swagger#/issue/issueListLabels
   */
  async getLabels({
    accessToken,
  }: {
    accessToken: VssueAPI.AccessToken;
  }): Promise<ResponseLabel[]> {
    const options: AxiosRequestConfig = {};
    if (accessToken) {
      options.headers = {
        Authorization: `bearer ${accessToken}`,
      };
    }
    const { data } = await this.$http.get<ResponseLabel[]>(
      `repos/${this.owner}/${this.repo}/labels`,
      options
    );
    return data || [];
  }

  /**
   * Create label
   *
   * @see https://gitea.com/api/swagger#/issue/issueCreateLabel
   */
  async postLabel({
    accessToken,
    label,
    color = '#3eaf7c',
    description,
  }: {
    accessToken: VssueAPI.AccessToken;
    label: string;
    color?: string;
    description?: string;
  }): Promise<number> {
    const { data } = await this.$http.post<ResponseLabel>(
      `repos/${this.owner}/${this.repo}/labels`,
      {
        name: label,
        color,
        description,
      },
      {
        headers: { Authorization: `bearer ${accessToken}` },
      }
    );
    return data.id;
  }

  /**
   * Get the parse HTML of markdown content
   *
   * @see https://gitea.com/api/swagger#/miscellaneous/renderMarkdown
   */
  async getMarkdownContent({
    accessToken,
    contentRaw,
  }: {
    accessToken?: VssueAPI.AccessToken;
    contentRaw: string;
  }): Promise<string> {
    const options: AxiosRequestConfig = {};
    if (accessToken) {
      options.headers = {
        Authorization: `bearer ${accessToken}`,
      };
    }
    const { data } = await this.$http.post<ResponseMarkdown>(
      `markdown`,
      {
        Context: `${this.owner}/${this.repo}`,
        Mode: 'gfm',
        Text: contentRaw,
        Wiki: false,
      },
      options
    );
    return data;
  }
}
