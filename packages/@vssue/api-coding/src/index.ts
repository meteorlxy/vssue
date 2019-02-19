import { VssueAPI } from 'vssue'

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
} from 'axios'

import {
  buildQuery,
  buildURL,
  concatURL,
  getCleanURL,
  parseQuery,
} from '@vssue/utils'

import {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
} from './utils'

/**
 * Coding API
 *
 * @see https://open.coding.net/references/api/
 * @see https://open.coding.net/references/oauth/
 * @see https://coding.net/help/doc/account/oauth.html
 */
export default class Coding implements VssueAPI.Instance {
  baseURL: string
  owner: string
  repo: string
  clientId: string
  clientSecret: string
  state: string
  proxy: string | ((url: string) => string)
  $http: AxiosInstance

  constructor ({
    baseURL = 'https://coding.net',
    owner,
    repo,
    clientId,
    clientSecret,
    state,
    proxy,
  }: VssueAPI.Options) {
    this.baseURL = baseURL
    this.owner = owner
    this.repo = repo

    this.clientId = clientId
    this.clientSecret = clientSecret
    this.state = state
    this.proxy = proxy

    this.$http = axios.create({
      baseURL,
      headers: {
        'Accept': 'application/json',
      },
    })

    this.$http.interceptors.response.use(response => {
      if (response.data.code) {
        return Promise.reject(Object.values(response.data.msg)[0])
      }
      return response
    })
  }

  /**
   * The platform api info
   */
  get platform (): VssueAPI.Platform {
    return {
      name: 'Coding',
      link: this.baseURL,
      version: '',
      meta: {
        reactable: false,
        sortable: true,
      },
    }
  }

  /**
   * Redirect to the authorization page of platform.
   *
   * @see https://open.coding.net/references/oauth/
   * @see https://coding.net/help/doc/account/oauth.html#i-3
   */
  redirectAuth (): void {
    window.location.href = buildURL(concatURL(this.baseURL, 'oauth_authorize.html'), {
      client_id: this.clientId,
      redirect_uri: window.location.href,
      response_type: 'code',
    })
  }

  /**
   * Handle authorization.
   *
   * @return A string for access token, `null` for no authorization code
   *
   * @see https://open.coding.net/references/oauth/
   * @see https://coding.net/help/doc/account/oauth.html#i-3
   *
   * @remarks
   * If the `code` exists in the query, remove them from query, and try to get the access token.
   */
  async handleAuth (): Promise<VssueAPI.AccessToken> {
    const query = parseQuery(window.location.search)
    if (query.code) {
      const code = query.code
      delete query.code
      const replaceURL = buildURL(getCleanURL(window.location.href), query) + window.location.hash
      window.history.replaceState(null, '', replaceURL)
      const accessToken = await this.getAccessToken({ code })
      return accessToken
    }
    return null
  }

  /**
   * Get user access token via `code`
   *
   * @param options.code - The code from the query
   *
   * @return User access token
   *
   * @see https://open.coding.net/references/oauth/
   * @see https://coding.net/help/doc/account/oauth.html#i-3
   */
  async getAccessToken ({
    code,
  }: {
    code: string
  }): Promise<string> {
    const originalURL = buildURL(concatURL(this.baseURL, 'api/oauth/access_token'), {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      code,
    })
    const proxyURL = typeof this.proxy === 'function'
      ? this.proxy(originalURL)
      : this.proxy
    const { data } = await this.$http.post(proxyURL)
    return data.access_token
  }

  /**
   * Get the logined user with access token.
   *
   * @param options.accessToken - User access token
   *
   * @return The user
   *
   * @see https://open.coding.net/references/api/
   * @see https://coding.net/help/doc/account/oauth.html#i-5
   */
  async getUser ({
    accessToken,
  }: {
    accessToken: VssueAPI.AccessToken
  }): Promise<VssueAPI.User> {
    const { data } = await this.$http.get('api/account/current_user', {
      headers: { 'Authorization': `token ${accessToken}` },
    })
    return normalizeUser(data, this.baseURL)
  }

  /**
   * Get issue of this page according to the issue id or the issue title
   *
   * @param options.accessToken - User access token
   * @param options.issueId - The id of issue
   * @param options.issueTitle - The title of issue
   *
   * @return The raw response of issue
   *
   * @see https://open.coding.net/references/api/
   * @see https://coding.net/help/doc/account/oauth.html#_id
   */
  async getIssue ({
    accessToken,
    issueId,
    issueTitle,
  }: {
    accessToken: VssueAPI.AccessToken
    issueId?: string | number
    issueTitle?: string
  }): Promise<VssueAPI.Issue | null> {
    throw new Error('501 Not Implemented')
  }

  /**
   * Create a new issue
   *
   * @param options.accessToken - User access token
   * @param options.title - The title of issue
   * @param options.content - The content of issue
   *
   * @return The created issue
   *
   * @see https://open.coding.net/references/api/
   * @see https://coding.net/help/doc/account/oauth.html#i-8
   */
  async postIssue ({
    accessToken,
    title,
    content,
  }: {
    accessToken: VssueAPI.AccessToken
    title: string
    content: string
  }): Promise<VssueAPI.Issue> {
    throw new Error('501 Not Implemented')
  }

  /**
   * Get comments of this page according to the issue id or the issue title
   *
   * @param options.accessToken - User access token
   * @param options.issueId - The id of issue
   * @param options.query - The query parameters
   *
   * @return The comments
   *
   * @see https://open.coding.net/references/api/
   */
  async getComments ({
    accessToken,
    issueId,
    query: {
      page = 1,
      perPage = 10,
      sort = 'desc',
    } = {},
  }: {
    accessToken: VssueAPI.AccessToken
    issueId: string | number
    query?: Partial<VssueAPI.Query>
  }): Promise<VssueAPI.Comments> {
    throw new Error('501 Not Implemented')
  }

  /**
   * Create a new comment
   *
   * @param options.accessToken - User access token
   * @param options.issueId - The id of issue
   * @param options.content - The content of comment
   *
   * @return The created comment
   *
   * @see https://open.coding.net/references/api/
   */
  async postComment ({
    accessToken,
    issueId,
    content,
  }: {
    accessToken: VssueAPI.AccessToken
    issueId: string | number
    content: string
  }): Promise<VssueAPI.Comment> {
    throw new Error('501 Not Implemented')
  }

  /**
   * Edit a comment
   *
   * @param options.accessToken - User access token
   * @param options.issueId - The id of issue
   * @param options.commentId - The id of comment
   * @param options.content - The content of comment
   *
   * @return The edited comment
   *
   * @see https://open.coding.net/references/api/
   */
  async putComment ({
    accessToken,
    issueId,
    commentId,
    content,
  }: {
    accessToken: VssueAPI.AccessToken
    issueId: string | number
    commentId: string | number
    content: string
  }): Promise<VssueAPI.Comment> {
    throw new Error('501 Not Implemented')
  }

  /**
   * Delete a comment
   *
   * @param options.accessToken - User access token
   * @param options.issueId - The id of issue
   * @param options.commentId - The id of comment
   *
   * @return `true` if succeed, `false` if failed
   *
   * @see https://open.coding.net/references/api/
   */
  async deleteComment ({
    accessToken,
    issueId,
    commentId,
  }: {
    accessToken: VssueAPI.AccessToken
    issueId: string | number
    commentId: string | number
  }): Promise<boolean> {
    throw new Error('501 Not Implemented')
  }

  /**
   * Coding does not support reactions now
   */
  async getCommentReactions (): Promise<VssueAPI.Reactions> {
    throw new Error('501 Not Implemented')
  }

  /**
   * Coding does not support reactions now
   */
  async postCommentReaction (): Promise<boolean> {
    throw new Error('501 Not Implemented')
  }
}
