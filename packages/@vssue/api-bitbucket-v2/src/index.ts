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
 * @see https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D/issues/%7Bissue_id%7D/comments
 */
export default class BitbucketV2 implements VssueAPI {
  baseURL: string
  owner: string
  repo: string
  clientId: string
  clientSecret: string
  state: string
  $http: AxiosInstance

  get platform () {
    return 'bitbucket'
  }

  get version () {
    return 'v2'
  }

  constructor ({
    baseURL = 'https://api.bitbucket.org/2.0/',
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

  redirectAuthorize () {
    window.location.href = buildURL('https://bitbucket.org/site/oauth2/authorize', {
      client_id: this.clientId,
      redirect_uri: window.location.href,
      response_type: 'code',
    })
  }

  async handleAuthorize () {
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

  async getAccessToken ({ code }) {
    const response = await this.$http.post(`https://cors-anywhere.herokuapp.com/${'https://bitbucket.org/site/oauth2/access_token'}`, buildQuery({
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
    const accessToken = response.data.access_token
    return accessToken
  }

  async getUser ({ accessToken }) {
    const response = await this.$http.get('/user', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    const user = response.data
    return normalizeUser(user)
  }

  async getIssues ({ accessToken }) {
    const options: AxiosRequestConfig = {
      params: {
        // to avoid caching
        timestamp: Date.now(),
      },
    }
    if (accessToken) {
      options.headers = {
        'Authorization': `Bearer ${accessToken}`,
      }
    }
    const response = await this.$http.get(`repositories/${this.owner}/${this.repo}/issues`, options)
    const issues = response.data.values
    return issues.map(normalizeIssue)
  }

  async getComments ({
    issueId,
    accessToken,
  }) {
    const options: AxiosRequestConfig = {
      params: {
        // to avoid caching
        timestamp: Date.now(),
      },
    }
    if (accessToken) {
      options.headers = {
        'Authorization': `Bearer ${accessToken}`,
      }
    }
    const response = await this.$http.get(`repositories/${this.owner}/${this.repo}/issues/${issueId}/comments`, options)
    const comments = response.data.values
    return comments.map(normalizeComment)
  }

  async createIssue ({
    title,
    content,
    accessToken,
  }) {
    const response = await this.$http.post(`repositories/${this.owner}/${this.repo}/issues`, {
      title,
      content: {
        raw: content,
      },
      priority: 'trivial',
      type: 'task',
    }, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    const issue = response.data
    return normalizeIssue(issue)
  }

  async createIssueComment ({
    issueId,
    content,
    accessToken,
  }) {
    const response = await this.$http.post(`repositories/${this.owner}/${this.repo}/issues/${issueId}/comments`, {
      content: {
        raw: content,
      },
    }, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    const comment = response.data
    return normalizeComment(comment)
  }

  async createIssueReaction () {
    // no support
  }

  async createCommentReaction () {
    // no support
  }
}
