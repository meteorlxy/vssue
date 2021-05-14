import { VssueAPI } from 'vssue';

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { buildURL, concatURL, getCleanURL, parseQuery } from '@vssue/utils';

import { normalizeUser, normalizeIssue, normalizeComment } from './utils';

import {
  ResponseAccessToken,
  ResponseUser,
  ResponseIssue,
  ResponseComment,
} from './types';

/**
 * Gitee REST API v5
 *
 * @see https://gitee.com/api/v5/swagger
 * @see https://gitee.com/api/v5/oauth_doc
 */
export default class GiteeV5 implements VssueAPI.Instance {
  baseURL: string;
  owner: string;
  repo: string;
  labels: Array<string>;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  state: string;
  proxy: string | ((url: string) => string);
  $http: AxiosInstance;

  constructor({
    baseURL = 'https://gitee.com',
    owner,
    repo,
    labels,
    clientId,
    clientSecret,
    redirectUri = window.location.href,
    state,
    proxy,
  }: VssueAPI.Options) {
    /* istanbul ignore if */
    if (typeof clientSecret === 'undefined' || typeof proxy === 'undefined') {
      throw new Error('clientSecret and proxy is required for Gitee V5');
    }
    this.baseURL = baseURL;
    this.owner = owner;
    this.repo = repo;
    this.labels = labels;

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.state = state;
    this.proxy = proxy;

    this.$http = axios.create({
      baseURL: concatURL(baseURL, 'api/v5'),
    });

    this.$http.interceptors.response.use(
      response => response,
      error => {
        if (error.response.data && error.response.data.message) {
          error.message = error.response.data.message;
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * The platform api info
   */
  get platform(): VssueAPI.Platform {
    return {
      name: 'Gitee',
      link: this.baseURL,
      version: 'v5',
      meta: {
        reactable: false,
        sortable: false,
      },
    };
  }

  /**
   * Redirect to the authorization page of platform.
   *
   * @see https://gitee.com/api/v5/oauth_doc
   */
  redirectAuth(): void {
    window.location.href = buildURL(
      concatURL(this.baseURL, 'oauth/authorize'),
      {
        client_id: this.clientId,
        redirect_uri: this.redirectUri,
        scope: 'user_info issues notes',
        response_type: 'code',
        state: this.state,
      }
    );
  }

  /**
   * Handle authorization.
   *
   * @see https://gitee.com/api/v5/oauth_doc
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
   * @see https://gitee.com/api/v5/oauth_doc
   */
  async getAccessToken({ code }: { code: string }): Promise<string> {
    const originalURL = concatURL(this.baseURL, 'oauth/token');
    const proxyURL =
      typeof this.proxy === 'function' ? this.proxy(originalURL) : this.proxy;
    const { data } = await this.$http.post<ResponseAccessToken>(proxyURL, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: window.location.href,
    });
    return data.access_token;
  }

  /**
   * Get the logged-in user with access token.
   *
   * @see https://gitee.com/api/v5/swagger#/getV5User
   */
  async getUser({
    accessToken,
  }: {
    accessToken: VssueAPI.AccessToken;
  }): Promise<VssueAPI.User> {
    const { data } = await this.$http.get<ResponseUser>('user', {
      params: { access_token: accessToken },
    });
    return normalizeUser(data);
  }

  /**
   * Get issue of this page according to the issue id or the issue title
   *
   * @see https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoIssues
   * @see https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoIssuesNumber
   * @see https://gitee.com/api/v5/swagger#/getV5SearchIssues
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
    const options: AxiosRequestConfig = {
      params: {
        // to avoid caching
        timestamp: Date.now(),
      },
    };

    if (accessToken) {
      options.params.access_token = accessToken;
    }

    if (issueId) {
      try {
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
      Object.assign(options.params, {
        q: issueTitle,
        repo: `${this.owner}/${this.repo}`,
        per_page: 1,
      });
      const { data } = await this.$http.get<ResponseIssue[]>(
        `search/issues`,
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
   * @see https://gitee.com/api/v5/swagger#/postV5ReposOwnerIssues
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
      `repos/${this.owner}/issues`,
      {
        access_token: accessToken,
        repo: this.repo,
        title,
        body: content,
        labels: this.labels.join(','),
      }
    );
    return normalizeIssue(data);
  }

  /**
   * Get comments of this page according to the issue id
   *
   * @see https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoIssuesNumberComments
   *
   * @remarks
   * Gitee V3 does not support sort for issue comments now.
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
    const options: AxiosRequestConfig = {
      params: {
        // pagination
        page: page,
        per_page: perPage,
        // 'sort': 'created',
        // 'direction': sort,
        // to avoid caching
        timestamp: Date.now(),
      },
      headers: {
        Accept: ['application/vnd.gitee.html+json'],
      },
    };
    if (accessToken) {
      options.params.access_token = accessToken;
    }

    const response = await this.$http.get<ResponseComment[]>(
      `repos/${this.owner}/${this.repo}/issues/${issueId}/comments`,
      options
    );

    const count = Number(response.headers.total_count);

    return {
      count: count,
      page: page,
      perPage: perPage,
      data: response.data.map(normalizeComment),
    };
  }

  /**
   * Create a new comment
   *
   * @see https://gitee.com/api/v5/swagger#/postV5ReposOwnerRepoIssuesNumberComments
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
        access_token: accessToken,
      },
      {
        headers: {
          Accept: ['application/vnd.gitee.html+json'],
        },
      }
    );
    return normalizeComment(data);
  }

  /**
   * Edit a comment
   *
   * @see https://gitee.com/api/v5/swagger#/patchV5ReposOwnerRepoIssuesCommentsId
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
        access_token: accessToken,
      },
      {
        headers: {
          Accept: ['application/vnd.gitee.html+json'],
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
        params: { access_token: accessToken },
      }
    );
    return status === 204;
  }

  /**
   * Gitee does not support reactions now
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getCommentReactions(options): Promise<VssueAPI.Reactions> {
    throw new Error('501 Not Implemented');
  }

  /**
   * Gitee does not support reactions now
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async postCommentReaction(options): Promise<boolean> {
    throw new Error('501 Not Implemented');
  }
}
