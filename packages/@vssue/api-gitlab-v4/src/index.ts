import {
  Reactions,
  VssueAPI,
  VssueAPIOptions,
} from 'vssue'

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
} from 'axios'

import {
  buildURL,
  concatURL,
  getCleanURL,
  parseQuery,
} from '@vssue/utils'

import {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
  normalizeReactions,
  mapReactionName,
} from './utils'

/**
 * @see https://docs.gitlab.com/ce/api/oauth2.html
 * @see https://docs.gitlab.com/ce/api/issues.html
 * @see https://docs.gitlab.com/ce/api/notes.html
 * @see https://docs.gitlab.com/ce/api/award_emoji.html
 */
export default class GitlabV4 implements VssueAPI {
  baseURL: string
  owner: string
  repo: string
  labels: string
  clientId: string
  clientSecret: string
  state: string
  $http: AxiosInstance

  private _encodedRepo: string

  get platform () {
    return 'gitlab'
  }

  get version () {
    return 'v4'
  }

  constructor ({
    baseURL = 'https://gitlab.com',
    owner,
    repo,
    labels,
    clientId,
    clientSecret,
    state,
  }: VssueAPIOptions) {
    this.baseURL = baseURL
    this.owner = owner
    this.repo = repo
    this.labels = labels

    this.clientId = clientId
    this.clientSecret = clientSecret
    this.state = state

    this._encodedRepo = encodeURIComponent(`${this.owner}/${this.repo}`)

    this.$http = axios.create({
      baseURL,
      headers: {
        'Accept': 'application/json',
      },
    })
  }

  redirectAuthorize () {
    window.location.href = buildURL(concatURL(this.baseURL, 'oauth/authorize'), {
      client_id: this.clientId,
      redirect_uri: window.location.href,
      response_type: 'code',
      state: this.state,
    })
  }

  async handleAuthorize () {
    const query = parseQuery(window.location.search)
    if (query.code) {
      if (query.state !== this.state) {
        return null
      }
      const code = query.code
      delete query.code
      delete query.state
      const replaceURL = buildURL(getCleanURL(window.location.href), query) + window.location.hash
      window.history.replaceState(null, '', replaceURL)
      const accessToken = await this.getAccessToken({ code })
      return accessToken
    }
    return null
  }

  async getAccessToken ({ code }) {
    const response = await this.$http.post(`https://cors-anywhere.herokuapp.com/${concatURL(this.baseURL, 'oauth/token')}`, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: window.location.href,
    })
    const accessToken = response.data.access_token
    return accessToken
  }

  async getUser ({ accessToken }) {
    const response = await this.$http.get('api/v4/user', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    const user = response.data
    return normalizeUser(user)
  }

  async getIssues ({ accessToken }) {
    const options: AxiosRequestConfig = {
      params: {
        labels: this.labels,
        // to avoid caching
        timestamp: Date.now(),
      },
    }
    if (accessToken) {
      options.headers = {
        'Authorization': `Bearer ${accessToken}`,
      }
    }
    const response = await this.$http.get(`api/v4/projects/${this._encodedRepo}/issues`, options)
    const issues = response.data
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
    const response = await this.$http.get(`api/v4/projects/${this._encodedRepo}/issues/${issueId}/notes`, options)
    const comments = response.data

    const getCommentsMeta: Array<Promise<void>> = []

    for (const comment of comments) {
      getCommentsMeta.push((async () => {
        comment.body_html = await this.getMarkdownContent({
          contentRaw: comment.body,
        })
      })())
      getCommentsMeta.push((async () => {
        comment.reactions = await this.getCommentReactions({
          issueId: issueId,
          commentId: comment.id,
          accessToken: accessToken,
        })
      })())
    }
    await Promise.all(getCommentsMeta)
    return comments.map(normalizeComment)
  }

  async getCommentReactions ({
    issueId,
    commentId,
    accessToken,
  }): Promise<Reactions> {
    const response = await this.$http.get(`api/v4/projects/${this._encodedRepo}/issues/${issueId}/notes/${commentId}/award_emoji`, {
      params: {
      },
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })

    const reactions = response.data
    return normalizeReactions(reactions)
  }

  async createIssue ({
    title,
    content,
    accessToken,
  }) {
    const response = await this.$http.post(`api/v4/projects/${this._encodedRepo}/issues`, {
      title,
      description: content,
      labels: this.labels,
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
    const response = await this.$http.post(`api/v4/projects/${this._encodedRepo}/issues/${issueId}/notes`, {
      body: content,
    }, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    const comment = response.data
    return normalizeComment(comment)
  }

  async createIssueReaction ({
    issueId,
    reaction,
    accessToken,
  }) {
    try {
      await this.$http.post(`api/v4/projects/${this._encodedRepo}/issues/${issueId}/award_emoji`, {
        name: mapReactionName(reaction),
      }, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      })
      return true
    } catch (e) {
      return false
    }
  }

  async createCommentReaction ({
    issueId,
    commentId,
    reaction,
    accessToken,
  }) {
    try {
      await this.$http.post(`api/v4/projects/${this._encodedRepo}/issues/${issueId}/notes/${commentId}/award_emoji`, {
        name: mapReactionName(reaction),
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return true
    } catch (e) {
      return false
    }
  }

  async getMarkdownContent ({ contentRaw }): Promise<string> {
    const response = await this.$http.post(`api/v4/markdown`, {
      text: contentRaw,
      gfm: true,
    })
    const content = response.data.html
    return content
  }
}
