import { VssueAPI } from 'vssue'

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
 * GitLab API V4
 *
 * @see https://docs.gitlab.com/ce/api/
 * @see https://docs.gitlab.com/ce/api/oauth2.html
 */
export default class GitlabV4 implements VssueAPI.Instance {
  baseURL: string
  owner: string
  repo: string
  labels: Array<string>
  clientId: string
  clientSecret: string
  state: string
  proxy: string | ((url: string) => string)
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
    proxy,
  }: VssueAPI.Options) {
    this.baseURL = baseURL
    this.owner = owner
    this.repo = repo
    this.labels = labels

    this.clientId = clientId
    this.clientSecret = clientSecret
    this.state = state
    this.proxy = proxy

    // @see https://docs.gitlab.com/ce/api/README.html#namespaced-path-encoding
    this._encodedRepo = encodeURIComponent(`${this.owner}/${this.repo}`)

    this.$http = axios.create({
      baseURL: concatURL(baseURL, 'api/v4'),
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
   *
   * @see https://docs.gitlab.com/ce/api/oauth2.html#1-requesting-authorization-code
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
   * @return A string for access token, `null` for no authorization code
   *
   * @see https://docs.gitlab.com/ce/api/oauth2.html#supported-oauth2-flows
   *
   * @remarks
   * If the `code` and `state` exist in the query, and the `state` matches, remove them from query, and try to get the access token.
   */
  async handleAuth (): Promise<VssueAPI.AccessToken> {
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
   *
   * @see https://docs.gitlab.com/ce/api/oauth2.html#2-requesting-access-token
   */
  async getAccessToken ({
    code,
  }: {
    code: string
  }): Promise<string> {
    const originalURL = concatURL(this.baseURL, 'oauth/token')
    const proxyURL = typeof this.proxy === 'function'
      ? this.proxy(originalURL)
      : this.proxy
    const { data } = await this.$http.post(proxyURL, {
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
   * @return The issue
   *
   * @see https://docs.gitlab.com/ce/api/issues.html#single-issue
   * @see https://docs.gitlab.com/ce/api/issues.html#list-issues
   * @see https://docs.gitlab.com/ce/api/README.html#pagination
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
        const { data } = await this.$http.get(`projects/${this._encodedRepo}/issues/${issueId}`, options)
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
        labels: this.labels.join(','),
        order_by: 'created_at',
        sort: 'asc',
        search: issueTitle,
      }
      const { data } = await this.$http.get(`projects/${this._encodedRepo}/issues`, options)
      const issue = data.map(normalizeIssue).find(item => item.title === issueTitle)
      return issue || null
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
   * @see https://docs.gitlab.com/ce/api/issues.html#new-issue
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
    const { data } = await this.$http.post(`projects/${this._encodedRepo}/issues`, {
      title,
      description: content,
      labels: this.labels.join(','),
    }, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
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
   * @see https://docs.gitlab.com/ce/api/notes.html#list-project-issue-notes
   * @see https://docs.gitlab.com/ce/api/README.html#pagination
   *
   * @remarks
   * Cannot get the HTML content and the reactions (award_emoji) here.
   * So have to request them via `markdown` and `award_emoji` API.
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
    const response = await this.$http.get(`projects/${this._encodedRepo}/issues/${issueId}/notes`, options)
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
   * Create a new comment
   *
   * @param options.accessToken - User access token
   * @param options.issueId - The id of issue
   * @param options.content - The content of comment
   *
   * @return The created comment
   *
   * @see https://docs.gitlab.com/ce/api/notes.html#create-new-issue-note
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
    const { data } = await this.$http.post(`projects/${this._encodedRepo}/issues/${issueId}/notes`, {
      body: content,
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
   * @see https://docs.gitlab.com/ce/api/notes.html#modify-existing-issue-note
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
    const { data } = await this.$http.put(`projects/${this._encodedRepo}/issues/${issueId}/notes/${commentId}`, {
      body: content,
    }, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })

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
    ])

    data.body_html = contentHTML
    data.reactions = reactions

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
   * @see https://docs.gitlab.com/ce/api/notes.html#delete-an-issue-note
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
    const { status } = await this.$http.delete(`projects/${this._encodedRepo}/issues/${issueId}/notes/${commentId}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    return status === 204
  }

  /**
   * Get reactions of a comment
   *
   * @param options.accessToken - User access token
   * @param options.issueId - The id of issue
   * @param options.commentId - The id of comment
   *
   * @return The comments
   *
   * @see https://docs.gitlab.com/ce/api/award_emoji.html#list-an-awardables-award-emoji
   */
  async getCommentReactions ({
    accessToken,
    issueId,
    commentId,
  }: {
    accessToken: VssueAPI.AccessToken
    issueId: string | number
    commentId: string | number
  }): Promise<VssueAPI.Reactions> {
    const { data } = await this.$http.get(`projects/${this._encodedRepo}/issues/${issueId}/notes/${commentId}/award_emoji`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    return normalizeReactions(data)
  }

  /**
   * Create a new reaction of a comment
   *
   * @param options.accessToken - User access token
   * @param options.issueId - The id of issue
   * @param options.commentId - The id of comment
   * @param options.reaction - The reaction
   *
   * @return `true` if succeed, `false` if already token
   *
   * @see https://docs.gitlab.com/ce/api/award_emoji.html#award-a-new-emoji
   */
  async postCommentReaction ({
    issueId,
    commentId,
    reaction,
    accessToken,
  }: {
    accessToken: VssueAPI.AccessToken
    issueId: string | number
    commentId: string | number
    reaction: keyof VssueAPI.Reactions
  }): Promise<boolean> {
    try {
      const response = await this.$http.post(`projects/${this._encodedRepo}/issues/${issueId}/notes/${commentId}/award_emoji`, {
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
      // have submitted an issue: https://gitlab.com/gitlab-org/gitlab-ce/issues/56147
      if (e.response && e.response.status === 404) {
        return false
      } else {
        throw e
      }
    }
  }

  /**
   * Get the parse HTML of markdown content
   *
   * @param options.accessToken - User access token
   * @param options.contentRaw - The id of issue
   *
   * @return The HTML string of parsed markdown
   *
   * @see https://docs.gitlab.com/ce/api/markdown.html
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
    const { data } = await this.$http.post(`markdown`, {
      text: contentRaw,
      gfm: true,
    }, options)
    return data.html
  }
}
