import { VssueAPI } from 'vssue';

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import {
  buildQuery,
  buildURL,
  concatURL,
  getCleanURL,
  parseQuery,
} from '@vssue/utils';

import {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
  normalizeReactions,
  mapReactionName,
} from './utils';

import {
  ResponseUser,
  ResponseIssue,
  ResponseComment,
  ResponseReaction,
  ResponseMarkdown,
} from './types';

/**
 * GitLab API V4
 *
 * @see https://docs.gitlab.com/ce/api/
 * @see https://docs.gitlab.com/ce/api/oauth2.html
 */
export default class GitlabV4 implements VssueAPI.Instance {
  baseURL: string;
  owner: string;
  repo: string;
  labels: Array<string>;
  clientId: string;
  state: string;
  $http: AxiosInstance;

  private _encodedRepo: string;

  constructor({
    baseURL = 'https://gitlab.com',
    owner,
    repo,
    labels,
    clientId,
    state,
  }: VssueAPI.Options) {
    this.baseURL = baseURL;
    this.owner = owner;
    this.repo = repo;
    this.labels = labels;

    this.clientId = clientId;
    this.state = state;

    // @see https://docs.gitlab.com/ce/api/README.html#namespaced-path-encoding
    this._encodedRepo = encodeURIComponent(`${this.owner}/${this.repo}`);

    this.$http = axios.create({
      baseURL: concatURL(baseURL, 'api/v4'),
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
      name: 'GitLab',
      link: this.baseURL,
      version: 'v4',
      meta: {
        reactable: true,
        sortable: true,
      },
    };
  }

  /**
   * Redirect to the authorization page of platform.
   *
   * @see https://docs.gitlab.com/ce/api/oauth2.html#1-requesting-authorization-code
   */
  redirectAuth(): void {
    const stateobj = {
      state: this.state,
      redirect_uri: window.location.href,
    };
    window.location.href = buildURL(
      concatURL(this.baseURL, 'oauth/authorize'),
      {
        client_id: this.clientId,
        redirect_uri: window.location.origin,
        response_type: 'token',
        state: btoa(JSON.stringify(stateobj)),
      }
    );
  }

  /**
   * Handle authorization.
   *
   * @see https://docs.gitlab.com/ce/api/oauth2.html#implicit-grant-flow
   *
   * @remarks
   * If the `access_token` and `state` exist in the query, and the `state` matches, remove them from query, and return the access token.
   */
  async handleAuth(): Promise<VssueAPI.AccessToken> {
    const hash = parseQuery(window.location.hash.slice(1));
    const stateobj = JSON.parse(atob(hash.state ? hash.state : btoa('{}')));
    if (!stateobj.state) {
      return null;
    }
    const accessToken = hash.access_token;
    delete hash.access_token;
    delete hash.token_type;
    delete hash.expires_in;
    delete hash.state;
    let hashString = buildQuery(hash);
    hashString = hashString && hashString.length > 0 ? `#${hashString}` : '';
    const replaceURL = `${getCleanURL(window.location.href)}${
      window.location.search
    }${hashString}`;
    window.history.replaceState(null, '', replaceURL);
    if (stateobj.redirect_uri) {
      window.location.href = `${stateobj.redirect_uri}${hashString}`;
    } else {
      window.location.href = `${window.location.origin}${hashString}`;
    }
    if (stateobj.state !== this.state) {
      return null;
    }
    if (!accessToken) {
      return null;
    }
    return accessToken;
  }

  /**
   * Get the logged-in user with access token.
   */
  async getUser({
    accessToken,
  }: {
    accessToken: VssueAPI.AccessToken;
  }): Promise<VssueAPI.User> {
    const { data } = await this.$http.get<ResponseUser>('user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return normalizeUser(data);
  }

  /**
   * Get issue of this page according to the issue id or the issue title
   *
   * @see https://docs.gitlab.com/ce/api/issues.html#single-issue
   * @see https://docs.gitlab.com/ce/api/issues.html#list-issues
   * @see https://docs.gitlab.com/ce/api/README.html#pagination
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
        Authorization: `Bearer ${accessToken}`,
      };
    }

    if (issueId) {
      try {
        const { data } = await this.$http.get<ResponseIssue>(
          `projects/${this._encodedRepo}/issues/${issueId}`,
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
        labels: this.labels.join(','),
        order_by: 'created_at',
        sort: 'asc',
        search: issueTitle,
      };
      const { data } = await this.$http.get<ResponseIssue[]>(
        `projects/${this._encodedRepo}/issues`,
        options
      );
      const issue = data
        .map(normalizeIssue)
        .find(item => item.title === issueTitle);
      return issue || null;
    }
  }

  /**
   * Create a new issue
   *
   * @see https://docs.gitlab.com/ce/api/issues.html#new-issue
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
      `projects/${this._encodedRepo}/issues`,
      {
        title,
        description: content,
        labels: this.labels.join(','),
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return normalizeIssue(data);
  }

  /**
   * Get comments of this page according to the issue id
   *
   * @see https://docs.gitlab.com/ce/api/notes.html#list-project-issue-notes
   * @see https://docs.gitlab.com/ce/api/README.html#pagination
   *
   * @remarks
   * Cannot get the HTML content and the reactions (award_emoji) here.
   * So have to request them via `markdown` and `award_emoji` API.
   */
  async getComments({
    accessToken,
    issueId,
    query: { page = 1, perPage = 10, sort = 'desc' } = {},
  }: {
    accessToken: VssueAPI.AccessToken;
    issueId: string | number;
    query?: Partial<VssueAPI.Query>;
  }): Promise<VssueAPI.Comments> {
    const options: AxiosRequestConfig = {
      params: {
        // pagination
        page: page,
        per_page: perPage,
        order_by: 'created_at',
        sort: sort,
      },
    };
    if (accessToken) {
      options.headers = {
        Authorization: `Bearer ${accessToken}`,
      };
    }
    const response = await this.$http.get<ResponseComment[]>(
      `projects/${this._encodedRepo}/issues/${issueId}/notes`,
      options
    );
    const commentsRaw = response.data;

    // gitlab api v4 should get parsed markdown content and reactions by other api
    // this is potentially to cause 429 Too Many Requests
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
      count: Number(response.headers['x-total']),
      page: Number(response.headers['x-page']),
      perPage: Number(response.headers['x-per-page']),
      data: commentsRaw.map(normalizeComment),
    };
  }

  /**
   * Create a new comment
   *
   * @see https://docs.gitlab.com/ce/api/notes.html#create-new-issue-note
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
      `projects/${this._encodedRepo}/issues/${issueId}/notes`,
      {
        body: content,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return normalizeComment(data);
  }

  /**
   * Edit a comment
   *
   * @see https://docs.gitlab.com/ce/api/notes.html#modify-existing-issue-note
   */
  async putComment({
    accessToken,
    issueId,
    commentId,
    content,
  }: {
    accessToken: VssueAPI.AccessToken;
    issueId: string | number;
    commentId: string | number;
    content: string;
  }): Promise<VssueAPI.Comment> {
    const { data } = await this.$http.put<ResponseComment>(
      `projects/${this._encodedRepo}/issues/${issueId}/notes/${commentId}`,
      {
        body: content,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const [contentHTML, reactions] = await Promise.all([
      this.getMarkdownContent({
        accessToken: accessToken,
        contentRaw: data.body,
      }),
      this.getCommentReactions({
        accessToken: accessToken,
        issueId: issueId,
        commentId: data.id,
      }),
    ]);

    data.body_html = contentHTML;
    data.reactions = reactions;

    return normalizeComment(data);
  }

  /**
   * Delete a comment
   *
   * @see https://docs.gitlab.com/ce/api/notes.html#delete-an-issue-note
   */
  async deleteComment({
    accessToken,
    issueId,
    commentId,
  }: {
    accessToken: VssueAPI.AccessToken;
    issueId: string | number;
    commentId: string | number;
  }): Promise<boolean> {
    const { status } = await this.$http.delete(
      `projects/${this._encodedRepo}/issues/${issueId}/notes/${commentId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return status === 204;
  }

  /**
   * Get reactions of a comment
   *
   * @see https://docs.gitlab.com/ce/api/award_emoji.html#list-an-awardables-award-emoji
   */
  async getCommentReactions({
    accessToken,
    issueId,
    commentId,
  }: {
    accessToken: VssueAPI.AccessToken;
    issueId: string | number;
    commentId: string | number;
  }): Promise<VssueAPI.Reactions> {
    const { data } = await this.$http.get<ResponseReaction[]>(
      `projects/${this._encodedRepo}/issues/${issueId}/notes/${commentId}/award_emoji`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return normalizeReactions(data);
  }

  /**
   * Create a new reaction of a comment
   *
   * @see https://docs.gitlab.com/ce/api/award_emoji.html#award-a-new-emoji
   */
  async postCommentReaction({
    issueId,
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
        `projects/${this._encodedRepo}/issues/${issueId}/notes/${commentId}/award_emoji`,
        {
          name: mapReactionName(reaction),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.status === 201;
    } catch (e) {
      // it could be a bug of gitlab
      // if a reaction (award emoji) has already existed, it returns a 404 response with a buggy message
      // have submitted an issue: https://gitlab.com/gitlab-org/gitlab-ce/issues/56147
      /* istanbul ignore next */
      if (e.response && e.response.status === 404) {
        return false;
      } else {
        throw e;
      }
    }
  }

  /**
   * Get the parse HTML of markdown content
   *
   * @see https://docs.gitlab.com/ce/api/markdown.html
   */
  async getMarkdownContent({
    accessToken,
    contentRaw,
  }: {
    accessToken?: string | null;
    contentRaw: string;
  }): Promise<string> {
    const options: AxiosRequestConfig = {};
    if (accessToken) {
      options.headers = {
        Authorization: `Bearer ${accessToken}`,
      };
    }
    const { data } = await this.$http.post<ResponseMarkdown>(
      `markdown`,
      {
        text: contentRaw,
        gfm: true,
      },
      options
    );
    return data.html;
  }
}
