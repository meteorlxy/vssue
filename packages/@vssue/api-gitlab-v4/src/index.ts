import {
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
export default class GitlabV4 implements VssueAPI.Instance {
  baseURL: string
  owner: string
  repo: string
  labels: string
  clientId: string
  clientSecret: string
  state: string
  $http: AxiosInstance

  private _encodedRepo: string

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
    this.labels = labels.join(',')

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

  /**
   * The platform api info
   */
  get platform (): VssueAPI.Platform {
    return {
      name: 'GitLab',
      link: this.baseURL,
      version: 'v4',
      meta: {
        reactable: true,
        sortable: true,
      },
    }
  }

  /**
   * Redirect to the authorization page of platform.
   */
  redirectAuth (): void {
    window.location.href = buildURL(concatURL(this.baseURL, 'oauth/authorize'), {
      client_id: this.clientId,
      redirect_uri: window.location.href,
      response_type: 'code',
      state: this.state,
    })
  }

  /**
   * Handle authorization.
   *
   * @remarks
   * If the `code` and `state` exist in the query, and the `state` matches, remove them from query, and try to get the access token.
   *
   * @return A string for access token, `null` for no authorization code
   */
  async handleAuth (): Promise<string | null> {
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

  /**
   * Get user access token via `code`
   *
   * @param options.code - The code from the query
   *
   * @return User access token
   */
  async getAccessToken ({ code }: { code: string }): Promise<string> {
    const { data } = await this.$http.post(`https://cors-anywhere.herokuapp.com/${concatURL(this.baseURL, 'oauth/token')}`, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: window.location.href,
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
    const { data } = await this.$http.get('api/v4/user', {
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
        const { data } = await this.$http.get(`api/v4/projects/${this._encodedRepo}/issues/${issueId}`, options)
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
        labels: this.labels,
        order_by: 'created_at',
        sort: 'asc',
        search: issueTitle,
      }
      const { data } = await this.$http.get(`api/v4/projects/${this._encodedRepo}/issues`, options)
      const issue = data.map(normalizeIssue).find(item => item.title === issueTitle)
      return issue || null
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
        'per_page': perPage,
        'order_by': 'created_at',
        'sort': sort,
      },
    }
    if (accessToken) {
      options.headers = {
        'Authorization': `Bearer ${accessToken}`,
      }
    }
    const response = await this.$http.get(`api/v4/projects/${this._encodedRepo}/issues/${issueId}/notes`, options)
    const commentsRaw = response.data

    // gitlab api v4 should get parsed markdown content and reactions by other api
    // this is potentially to cause 429 Too Many Requests
    const getCommentsMeta: Array<Promise<void>> = []

    for (const comment of commentsRaw) {
      getCommentsMeta.push((async () => {
        comment.body_html = await this.getMarkdownContent({
          accessToken: accessToken,
          contentRaw: comment.body,
        })
      })())
      getCommentsMeta.push((async () => {
        comment.reactions = await this.getCommentReactions({
          accessToken: accessToken,
          issueId: issueId,
          commentId: comment.id,
        })
      })())
    }

    await Promise.all(getCommentsMeta)

    return {
      count: Number(response.headers['x-total']),
      page: Number(response.headers['x-page']),
      perPage: Number(response.headers['x-per-page']),
      data: commentsRaw.map(normalizeComment),
    }
  }

  /**
   * Get the parse HTML of markdown content
   *
   * @param options.accessToken - User access token
   * @param options.contentRaw - The id of issue
   *
   * @return `true` if succeed, `false` if failed
   */
  async getMarkdownContent ({
    accessToken,
    contentRaw,
  }: {
    accessToken?: string | null,
    contentRaw: string,
  }): Promise<string> {
    const options: AxiosRequestConfig = {}
    if (accessToken) {
      options.headers = {
        'Authorization': `Bearer ${accessToken}`,
      }
    }
    const { data } = await this.$http.post(`api/v4/markdown`, {
      text: contentRaw,
      gfm: true,
    }, options)
    return data.html
  }

  /**
   * Get reactions of a cooment
   *
   * @param options.accessToken - User access token
   * @param options.issueId - The id of issue
   * @param options.commentId - The id of comment
   *
   * @return The comments
   */
  async getCommentReactions ({
    accessToken,
    issueId,
    commentId,
  }): Promise<VssueAPI.Reactions> {
    const { data } = await this.$http.get(`api/v4/projects/${this._encodedRepo}/issues/${issueId}/notes/${commentId}/award_emoji`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    return normalizeReactions(data)
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
    const { data } = await this.$http.post(`api/v4/projects/${this._encodedRepo}/issues`, {
      title,
      description: content,
      labels: this.labels,
    }, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    return normalizeIssue(data)
  }

  /**
   * Create a new comment
   *
   * @param options.accessToken - User access token
   * @param options.issueId - The id of issue
   * @param options.content - The content of comment
   *
   * @return The created comment
   */
  async createComment ({
    accessToken,
    issueId,
    content,
  }): Promise<VssueAPI.Comment> {
    const { data } = await this.$http.post(`api/v4/projects/${this._encodedRepo}/issues/${issueId}/notes`, {
      body: content,
    }, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    return normalizeComment(data)
  }

  /**
   * Create a new reaction of issue
   *
   * @param options.accessToken - User access token
   * @param options.issueId - The id of issue
   * @param options.reaction - The reaction
   *
   * @return `true` if succeed, `false` if already token
   */
  async createIssueReaction ({
    accessToken,
    issueId,
    reaction,
  }): Promise<boolean> {
    try {
      const response = await this.$http.post(`api/v4/projects/${this._encodedRepo}/issues/${issueId}/award_emoji`, {
        name: mapReactionName(reaction),
      }, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      })
      return response.status === 201
    } catch (e) {
      if (e.response && e.response.status === 404) {
        return false
      } else {
        throw e
      }
    }
  }

  /**
   * Create a new reaction of comment
   *
   * @param options.accessToken - User access token
   * @param options.issueId - The id of issue
   * @param options.commentId - The id of comment
   * @param options.reaction - The reaction
   *
   * @return `true` if succeed, `false` if already token
   */
  async createCommentReaction ({
    issueId,
    commentId,
    reaction,
    accessToken,
  }): Promise<boolean> {
    try {
      const response = await this.$http.post(`api/v4/projects/${this._encodedRepo}/issues/${issueId}/notes/${commentId}/award_emoji`, {
        name: mapReactionName(reaction),
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response.status === 201
    } catch (e) {
      // it could be a bug of gitlab
      // if a reaction (award emoji) has already existed, it returns a 404 response with a buggy message
      // have submitted a issue: https://gitlab.com/gitlab-org/gitlab-ce/issues/56147
      if (e.response && e.response.status === 404) {
        return false
      } else {
        throw e
      }
    }
  }
}
