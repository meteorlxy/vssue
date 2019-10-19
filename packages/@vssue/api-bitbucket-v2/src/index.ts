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
 * Bitbucket API V2
 *
 * @see https://developer.atlassian.com/bitbucket/api/2/reference/
 * @see https://confluence.atlassian.com/bitbucket/oauth-on-bitbucket-cloud-238027431.html
 */
export default class BitbucketV2 implements VssueAPI.Instance {
  baseURL: string
  owner: string
  repo: string
  clientId: string
  state: string
  $http: AxiosInstance

  constructor ({
    baseURL = 'https://bitbucket.org',
    owner,
    repo,
    clientId,
    state,
  }: VssueAPI.Options) {
    this.baseURL = baseURL
    this.owner = owner
    this.repo = repo

    this.clientId = clientId
    this.state = state

    this.$http = axios.create({
      baseURL: 'https://api.bitbucket.org/2.0',
      headers: {
        'Accept': 'application/json',
      },
    })
  }

  /**
   * The platform api info
   */
  get platform (): VssueAPI.Platform {
    return {
      name: 'Bitbucket',
      link: this.baseURL,
      version: 'v2',
      meta: {
        reactable: false,
        sortable: true,
      },
    }
  }

  /**
   * Redirect to the authorization page of platform.
   *
   * @see https://developer.atlassian.com/bitbucket/api/2/reference/meta/authentication#oauth-2
   */
  redirectAuth (): void {
    window.location.href = buildURL(concatURL(this.baseURL, 'site/oauth2/authorize'), {
      client_id: this.clientId,
      redirect_uri: window.location.href,
      response_type: 'token',
      state: this.state,
    })
  }

  /**
   * Handle authorization.
   *
   * @return A string for access token, `null` for no authorization code
   *
   * @see https://developer.atlassian.com/bitbucket/api/2/reference/meta/authentication#oauth-2
   *
   * @remarks
   * If the `access_token` and `state` exist in the query, and the `state` matches, remove them from query, and return the access token.
   */
  async handleAuth (): Promise<VssueAPI.AccessToken> {
    const hash = parseQuery(window.location.hash.slice(1))
    if (!hash.access_token || hash.state !== this.state) {
      return null
    }
    const accessToken = hash.access_token
    delete hash.access_token
    delete hash.token_type
    delete hash.expires_in
    delete hash.state
    delete hash.scopes
    const hashString = buildQuery(hash)
    const newHash = hashString ? `#${hashString}` : ''
    const replaceURL = `${getCleanURL(window.location.href)}${window.location.search}${newHash}`
    window.history.replaceState(null, '', replaceURL)
    return accessToken
  }

  /**
   * Get the logged-in user with access token.
   *
   * @param options.accessToken - User access token
   *
   * @return The user
   *
   * @see https://developer.atlassian.com/bitbucket/api/2/reference/resource/user
   */
  async getUser ({
    accessToken,
  }: {
    accessToken: VssueAPI.AccessToken
  }): Promise<VssueAPI.User> {
    const { data } = await this.$http.get('user', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    return normalizeUser(data)
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
   * @see https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D/issues/%7Bissue_id%7D#get
   * @see https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D/issues#get
   * @see https://developer.atlassian.com/bitbucket/api/2/reference/meta/pagination
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
    const options: AxiosRequestConfig = {}

    if (accessToken) {
      options.headers = {
        'Authorization': `Bearer ${accessToken}`,
      }
    }

    if (issueId) {
      try {
        options.params = {
          // to avoid caching
          timestamp: Date.now(),
        }
        const { data } = await this.$http.get(`repositories/${this.owner}/${this.repo}/issues/${issueId}`, options)
        return normalizeIssue(data)
      } catch (e) {
        if (e.response && e.response.status === 404) {
          return null
        } else {
          throw e
        }
      }
    } else {
      options.params = {
        sort: 'created_on',
        q: `title="${issueTitle}"`,
        // to avoid caching
        timestamp: Date.now(),
      }
      const { data } = await this.$http.get(`repositories/${this.owner}/${this.repo}/issues`, options)
      return data.size > 0 ? normalizeIssue(data.values[0]) : null
    }
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
   * @see https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D/issues#post
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
    const { data } = await this.$http.post(`repositories/${this.owner}/${this.repo}/issues`, {
      title,
      content: {
        raw: content,
      },
      priority: 'trivial',
      kind: 'task',
    }, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    data.links.html = {
      href: concatURL(this.baseURL, `${this.owner}/${this.repo}/issues/${data.id}`),
    }
    return normalizeIssue(data)
  }

  /**
   * Get comments of this page according to the issue id
   *
   * @param options.accessToken - User access token
   * @param options.issueId - The id of issue
   * @param options.query - The query parameters
   *
   * @return The comments
   *
   * @see https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D/issues/%7Bissue_id%7D/comments#get
   * @see https://developer.atlassian.com/bitbucket/api/2/reference/meta/pagination
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
    const options: AxiosRequestConfig = {
      params: {
        // pagination
        'page': page,
        'pagelen': perPage,
        'sort': sort === 'desc' ? '-created_on' : 'created_on',
        // to avoid caching
        timestamp: Date.now(),
      },
    }
    if (accessToken) {
      options.headers = {
        'Authorization': `Bearer ${accessToken}`,
      }
    }
    const { data } = await this.$http.get(`repositories/${this.owner}/${this.repo}/issues/${issueId}/comments`, options)
    return {
      count: data.size,
      page: data.page,
      perPage: data.pagelen,
      data: data.values.filter(item => item.content.raw !== null).map(normalizeComment),
    }
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
   * @see https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D/issues/%7Bissue_id%7D/comments#post
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
    const { data } = await this.$http.post(`repositories/${this.owner}/${this.repo}/issues/${issueId}/comments`, {
      content: {
        raw: content,
      },
    }, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    return normalizeComment(data)
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
   * @see https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D/issues/%7Bissue_id%7D/comments/%7Bcomment_id%7D#put
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
    const { data } = await this.$http.put(`repositories/${this.owner}/${this.repo}/issues/${issueId}/comments/${commentId}`, {
      content: {
        raw: content,
      },
    }, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    return normalizeComment(data)
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
   * @see https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D/issues/%7Bissue_id%7D/comments/%7Bcomment_id%7D#delete
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
    const { status } = await this.$http.delete(`repositories/${this.owner}/${this.repo}/issues/${issueId}/comments/${commentId}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    return status === 204
  }

  /**
   * Bitbucket does not support reactions now
   */
  async getCommentReactions (options): Promise<VssueAPI.Reactions> {
    throw new Error('501 Not Implemented')
  }

  /**
   * Bitbucket does not support reactions now
   */
  async postCommentReaction (options): Promise<boolean> {
    throw new Error('501 Not Implemented')
  }
}
