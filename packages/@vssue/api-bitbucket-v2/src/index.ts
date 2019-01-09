import {
  VssueAPI,
  VssueAPIOptions,
} from 'vssue'

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
} from 'axios'

import {
  buildQuery,
  buildURL,
  getCleanURL,
  parseQuery,
} from '@vssue/utils'

import {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
} from './utils'

/**
 * @see https://confluence.atlassian.com/bitbucket/oauth-on-bitbucket-cloud-238027431.html
 * @see https://developer.atlassian.com/bitbucket/api/2/reference/meta/authentication
 * @see https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D/issues
 * @see https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D/issues/%7Bissue_id%7D/comments
 */
export default class BitbucketV2 implements VssueAPI.Instance {
  baseURL: string
  owner: string
  repo: string
  clientId: string
  clientSecret: string
  state: string
  $http: AxiosInstance

  constructor ({
    baseURL = 'https://api.bitbucket.org',
    owner,
    repo,
    clientId,
    clientSecret,
    state,
  }: VssueAPIOptions) {
    this.baseURL = baseURL
    this.owner = owner
    this.repo = repo

    this.clientId = clientId
    this.clientSecret = clientSecret
    this.state = state

    this.$http = axios.create({
      baseURL,
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
      link: 'https://bitbucket.org',
      version: 'v2',
      meta: {
        reactable: false,
        sortable: true,
      },
    }
  }

  /**
   * Redirect to the authorization page of platform.
   */
  redirectAuth (): void {
    window.location.href = buildURL('https://bitbucket.org/site/oauth2/authorize', {
      client_id: this.clientId,
      redirect_uri: window.location.href,
      response_type: 'code',
    })
  }

  /**
   * Handle authorization.
   *
   * @remarks
   * If the `code` exists in the query, remove them from query, and try to get the access token.
   *
   * @return A string for access token, `null` for no authorization code
   */
  async handleAuth (): Promise<string | null> {
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
   */
  async getAccessToken ({ code }: { code: string }): Promise<string> {
    const { data } = await this.$http.post(`https://cors-anywhere.herokuapp.com/${'https://bitbucket.org/site/oauth2/access_token'}`, buildQuery({
      grant_type: 'authorization_code',
      redirect_uri: window.location.href,
      code,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: this.clientId,
        password: this.clientSecret,
      },
    })
    return data.access_token
  }

  /**
   * Get the logined user with access token.
   *
   * @param options.accessToken - User access token
   *
   * @return The user
   */
  async getUser ({ accessToken }): Promise<VssueAPI.User> {
    const { data } = await this.$http.get('2.0/user', {
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
   */
  async getIssue ({
    accessToken,
    issueId,
    issueTitle,
  }): Promise<VssueAPI.Issue | null> {
    const options: AxiosRequestConfig = {}

    if (accessToken) {
      options.headers = {
        'Authorization': `Bearer ${accessToken}`,
      }
    }

    if (issueId) {
      try {
        const { data } = await this.$http.get(`2.0/repositories/${this.owner}/${this.repo}/issues/${issueId}`, options)
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
      }
      const { data } = await this.$http.get(`2.0/repositories/${this.owner}/${this.repo}/issues`, options)
      return data.size > 0 ? normalizeIssue(data.values[0]) : null
    }
  }

  /**
   * Get comments of this page according to the issue id or the issue title
   *
   * @param options.accessToken - User access token
   * @param options.issueId - The id of issue
   * @param options.query - The query parameters
   *
   * @return The comments
   */
  async getComments ({
    accessToken,
    issueId,
    query: {
      page = 1,
      perPage = 10,
      sort = 'desc',
    } = {},
  }): Promise<VssueAPI.Comments> {
    const options: AxiosRequestConfig = {
      params: {
        // pagination
        'page': page,
        'pagelen': perPage,
        'sort': sort === 'desc' ? '-created_on' : 'created_on',
      },
    }
    if (accessToken) {
      options.headers = {
        'Authorization': `Bearer ${accessToken}`,
      }
    }
    const { data } = await this.$http.get(`2.0/repositories/${this.owner}/${this.repo}/issues/${issueId}/comments`, options)
    return {
      count: data.size,
      page: data.page,
      perPage: data.pagelen,
      data: data.values.map(normalizeComment),
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
   */
  async createIssue ({
    accessToken,
    title,
    content,
  }): Promise<VssueAPI.Issue> {
    const { data } = await this.$http.post(`2.0/repositories/${this.owner}/${this.repo}/issues`, {
      title,
      content: {
        raw: content,
      },
      priority: 'trivial',
      type: 'task',
    }, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    return normalizeIssue(data)
  }

  async createComment ({
    accessToken,
    issueId,
    content,
  }): Promise<VssueAPI.Comment> {
    const { data } = await this.$http.post(`2.0/repositories/${this.owner}/${this.repo}/issues/${issueId}/comments`, {
      content: {
        raw: content,
      },
    }, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    return normalizeComment(data)
  }

  /**
   * Bitbucket does not support reactions now
   */
  async createIssueReaction (): Promise<boolean> {
    throw new Error('Reactions Not Implemented')
  }

  /**
   * Bitbucket does not support reactions now
   */
  async createCommentReaction (): Promise<boolean> {
    throw new Error('Reactions Not Implemented')
  }
}
