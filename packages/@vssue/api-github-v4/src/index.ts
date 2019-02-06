import { VssueAPI } from '../../../vssue/types'

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
 * Github GraphQL API v4
 *
 * @see https://developer.github.com/v4/
 * @see https://developer.github.com/v4/explorer/
 * @see https://developer.github.com/apps/building-oauth-apps/
 */
export default class GithubV4 implements VssueAPI.Instance {
  baseURL: string
  owner: string
  repo: string
  labels: Array<string>
  clientId: string
  clientSecret: string
  state: string
  proxy: string | ((url: string) => string)
  $http: AxiosInstance

  private _pageInfo: {
    page: number
    startCursor: string | null
    endCursor: string | null
    sort: string | null
    perPage: number | null
  }

  constructor ({
    baseURL = 'https://github.com',
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

    this._pageInfo = {
      page: 1,
      startCursor: null,
      endCursor: null,
      sort: null,
      perPage: null,
    }

    this.$http = axios.create({
      baseURL: baseURL === 'https://github.com' ? 'https://api.github.com' : concatURL(baseURL, 'api'),
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    this.$http.interceptors.response.use(function (response) {
      if (response.data.error) {
        return Promise.reject(response.data.error_description)
      }
      if (response.data.errors) {
        return Promise.reject(response.data.errors[0].message)
      }
      return response
    })
  }

  /**
   * The platform api info
   */
  get platform (): VssueAPI.Platform {
    return {
      name: 'GitHub',
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
   * @see https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#1-request-a-users-github-identity
   */
  redirectAuth (): void {
    window.location.href = buildURL(concatURL(this.baseURL, 'login/oauth/authorize'), {
      client_id: this.clientId,
      redirect_uri: window.location.href,
      scope: 'public_repo',
      state: this.state,
    })
  }

  /**
   * Handle authorization.
   *
   * @return A string for access token, `null` for no authorization code
   *
   * @see https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
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
   * @see https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#2-users-are-redirected-back-to-your-site-by-github
   */
  async getAccessToken ({
    code,
  }: {
    code: string
  }): Promise<string> {
    /**
     * access_token api does not support cors
     * @see https://github.com/isaacs/github/issues/330
     */
    const originalURL = concatURL(this.baseURL, 'login/oauth/access_token')
    const proxyURL = typeof this.proxy === 'function'
      ? this.proxy(originalURL)
      : this.proxy
    const { data } = await this.$http.post(proxyURL, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      /**
       * useless but mentioned in docs
       */
      // redirect_uri: window.location.href,
      // state: this.state,
    }, {
      headers: {
        'Accept': 'application/json',
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
   *
   * @see https://developer.github.com/v4/query/ viewer
   * @see https://developer.github.com/v4/object/user/
   */
  async getUser ({
    accessToken,
  }: {
    accessToken: VssueAPI.AccessToken
  }): Promise<VssueAPI.User> {
    const { data } = await this.$http.post('graphql', {
      query: `\
query getUser {
  viewer {
    login
    avatarUrl
    url
  }
}`,
    }, {
      headers: { 'Authorization': `token ${accessToken}` },
    })
    return normalizeUser(data.data.viewer)
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
   * @see https://developer.github.com/v4/object/repository/
   * @see https://developer.github.com/v4/object/issueconnection/
   * @see https://developer.github.com/v4/object/issue/
   *
   * @remarks
   * The IssueConnection does not have title filter for now, and the number of results is limited to 100.
   * For now, if issues with the labels are more than 100, we have to request the next page(not implemented yet).
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
        'Authorization': `token ${accessToken}`,
      }
    }

    if (issueId) {
      try {
        const { data } = await this.$http.post(`graphql`, {
          query: `\
query getIssueById {
  repository(owner: "${this.owner}", name: "${this.repo}") {
    issue (number: ${issueId}) {
      id
      number
      title
      body
      url
    }
  }
}`,
        }, options)
        return normalizeIssue(data.data.repository.issue)
      } catch (e) {
        if (e.response && e.response.status === 404) {
          return null
        } else {
          throw e
        }
      }
    } else {
      const { data } = await this.$http.post(`graphql`, {
        variables: {
          owner: this.owner,
          repo: this.repo,
          labels: this.labels,
        },
        query: `\
query getIssueByTitle(
  $owner: String!
  $repo: String!
  $labels: [String!]!
) {
  repository(owner: $owner, name: $repo) {
    issues(
      orderBy: {
        field: CREATED_AT
        direction: ASC
      }
      labels: $labels
      first: 100
    ) {
      nodes {
        id
        number
        title
        body
        url
      }
    }
  }
}`,
      }, options)
      const issue = data.data.repository.issues.nodes.map(normalizeIssue).find(item => item.title === issueTitle)
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
   * @see https://developer.github.com/v4/mutation/createissue/
   * @see https://developer.github.com/v4/input_object/createissueinput/
   *
   * @remarks
   * Create issue requires repositoryId, which should be requested in the first request.
   * Create issue with labels requires labelIds, which is difficult to get.
   *
   * Emmmm... Let's fallback to v3 for now
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
    const { data } = await this.$http.post(`repos/${this.owner}/${this.repo}/issues`, {
      title,
      body: content,
      labels: this.labels,
    }, {
      headers: { 'Authorization': `token ${accessToken}` },
    })
    return normalizeIssue(data)
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
   * @see https://developer.github.com/v4/object/issuecommentconnection/
   *
   * @reamrks
   * No offset implemented, so it's difficult to implement REST-like pagination
   * For now, we use an internal `_pageInfo` var to hack that
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
    const options: AxiosRequestConfig = {}
    if (accessToken) {
      options.headers = {
        'Authorization': `token ${accessToken}`,
      }
    }

    if (this._pageInfo.sort !== null && sort !== this._pageInfo.sort) {
      page = 1
    }

    const {
      firstOrLast,
      afterOrBefore,
      cursor,
    } = this._getQueryParams({
      page,
      sort,
    })

    const { data } = await this.$http.post(`graphql`, {
      variables: {
        owner: this.owner,
        repo: this.repo,
        issueId,
        perPage,
      },
      query: `\
query getComments(
  $owner: String!
  $repo: String!
  $issueId: Int!
  $perPage: Int!
) {
  repository(owner: $owner, name: $repo) {
    issue(number: $issueId) {
      comments(
        ${firstOrLast}: $perPage
        ${afterOrBefore === null ? '' : `${afterOrBefore}: "${cursor}"`}
      ) {
        totalCount
        pageInfo {
          endCursor
          startCursor
        }
        nodes {
          id
          body
          bodyHTML
          createdAt
          updatedAt
          author {
            avatarUrl
            login
            url
          }
          reactionGroups {
            users (first: 0) {
              totalCount
            }
            content
          }
        }
      }
    }
  }
}`,
    }, options)

    const comments = data.data.repository.issue.comments

    if (sort === 'desc') {
      comments.nodes.reverse()
    }

    this._pageInfo = {
      page,
      startCursor: comments.pageInfo.startCursor,
      endCursor: comments.pageInfo.endCursor,
      sort,
      perPage,
    }

    return {
      count: comments.totalCount,
      page: page,
      perPage: perPage,
      data: comments.nodes.map(normalizeComment),
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
   * @see https://developer.github.com/v4/mutation/addcomment/
   * @see https://developer.github.com/v4/input_object/addcommentinput/
   *
   * @remarks
   * Create comment requires the Node ID of issue, which is different with the issue "id"
   * Fallback to v3 for now
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
    const { data } = await this.$http.post(`${this.baseURL === 'https://github.com' ? '' : 'v3/'}repos/${this.owner}/${this.repo}/issues/${issueId}/comments`, {
      body: content,
    }, {
      headers: {
        'Authorization': `token ${accessToken}`,
        'Accept': [
          'application/vnd.github.v3.raw+json',
          'application/vnd.github.v3.html+json',
          'application/vnd.github.squirrel-girl-preview',
        ],
      },
    })
    return {
      id: data.id,
      content: data.body_html,
      contentRaw: data.body,
      author: {
        username: data.user.login,
        avatar: data.avatar_url,
        homepage: data.html_url,
      },
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      reactions: {
        like: data.reactions['+1'],
        unlike: data.reactions['-1'],
        heart: data.reactions['heart'],
      },
    }
  }

  /**
   * Edit a comment
   *
   * @param options.accessToken - User access token
   * @param options.commentId - The id of comment
   * @param options.content - The content of comment
   *
   * @return The edited comment
   *
   * @see https://developer.github.com/v4/mutation/updateissuecomment/
   * @see https://developer.github.com/v4/input_object/updateissuecommentinput/
   *
   * @remarks
   * This mutation is listed in the docs, but has not been implemented for now
   * As the commentId of v4 and v3 is different, cannot fallback to v3, throw an error instead
   */
  async putComment ({
    accessToken,
    commentId,
    content,
  }: {
    accessToken: VssueAPI.AccessToken
    issueId: string | number
    commentId: string | number
    content: string
  }): Promise<VssueAPI.Comment> {
    throw new Error('Edit comments in Github V4 has not been implemented')
    /* eslint-disable-next-line no-unreachable */
    const { data } = await this.$http.post(`graphql`, {
      variables: {
        commentId,
        content,
      },
      query: `\
mutation putComment(
  $commentId: ID!,
  $content: String!,
) {
  updateIssueComment(input: {
    id: $commentId
    body: $content
  }) {
    commentEdge {
      node {
        id
        body
        bodyHTML
        createdAt
        updatedAt
        author {
          avatarUrl
          login
          url
        }
        reactionGroups {
          users (first: 0) {
            totalCount
          }
          content
        }
      }
    }
  }
}`,
    }, {
      headers: {
        'Authorization': `token ${accessToken}`,
      },
    })
    return normalizeComment(data)
  }

  /**
   * Delete a comment
   *
   * @param options.accessToken - User access token
   * @param options.commentId - The id of comment
   *
   * @return `true` if succeed, `false` if failed
   *
   * @see https://developer.github.com/v4/mutation/deleteissuecomment/
   *
   * @remarks
   * This mutation is listed in the docs, but has not been implemented for now
   * As the commentId of v4 and v3 is different, cannot fallback to v3, throw an error instead
   */
  async deleteComment ({
    accessToken,
    commentId,
  }: {
    accessToken: VssueAPI.AccessToken
    issueId: string | number
    commentId: string | number
  }): Promise<boolean> {
    throw new Error('Delete comments in Github V4 has not been implemented')
    /* eslint-disable-next-line no-unreachable */
    await this.$http.post(`graphql`, {
      variables: {
        commentId,
      },
      query: `\
  mutation deleteComment(
    $commentId: ID!,
  ) {
    deleteIssueComment(input: {
      id: $commentId
    }) {
      clientMutationId
    }
  }`,
    }, {
      headers: {
        'Authorization': `token ${accessToken}`,
      },
    })
    return true
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
   * @remarks
   * This query has not been implemented, use the comments query instead
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
    const {
      firstOrLast,
      afterOrBefore,
      cursor,
    } = this._getQueryParams()

    const { data } = await this.$http.post(`graphql`, {
      variables: {
        owner: this.owner,
        repo: this.repo,
        issueId,
        perPage: this._pageInfo.perPage,
      },
      query: `\
query getComments(
  $owner: String!
  $repo: String!
  $issueId: Int!
  $perPage: Int!
) {
  repository(owner: $owner, name: $repo) {
    issue(number: $issueId) {
      comments(
        ${firstOrLast}: $perPage
        ${afterOrBefore === null ? '' : `${afterOrBefore}: "${cursor}"`}
      ) {
        nodes {
          id
          reactionGroups {
            users (first: 0) {
              totalCount
            }
            content
          }
        }
      }
    }
  }
}`,
    }, {
      headers: { 'Authorization': `token ${accessToken}` },
    })

    const comment = data.data.repository.issue.comments.nodes.find(item => item.id === commentId)

    return normalizeReactions(comment.reactionGroups)
  }

  /**
   * Create a new reaction of a comment
   *
   * @param options.accessToken - User access token
   * @param options.commentId - The id of comment
   * @param options.reaction - The reaction
   *
   * @return `true` if succeed, `false` if already token
   *
   * @see https://developer.github.com/v4/mutation/addreaction/
   * @see https://developer.github.com/v4/input_object/addreactioninput/
   */
  async postCommentReaction ({
    accessToken,
    commentId,
    reaction,
  }: {
    accessToken: VssueAPI.AccessToken
    issueId: string | number
    commentId: string | number
    reaction: keyof VssueAPI.Reactions
  }): Promise<boolean> {
    await this.$http.post(`graphql`, {
      variables: {
        commentId,
        content: mapReactionName(reaction),
      },
      query: `\
mutation postCommentReaction(
  $commentId: ID!,
  $content: ReactionContent!,
) {
  addReaction(input: {
    subjectId: $commentId
    content: $content
  }) {
    reaction {
      databaseId
    }
  }
}`,
    }, {
      headers: { 'Authorization': `token ${accessToken}` },
    })
    return true
  }

  private _getQueryParams ({
    page = this._pageInfo.page,
    sort = this._pageInfo.sort,
  }: {
    page?: number
    sort?: string | null
  } = {}): {
    firstOrLast: string
    afterOrBefore: string | null
    cursor: string | null
  } {
    let firstOrLast: string
    let afterOrBefore: string | null
    let cursor: string | null

    if (page === 1) {
      firstOrLast = (sort === 'asc' ? 'first' : 'last')
      afterOrBefore = null
      cursor = null
    } else {
      if (sort === 'asc') {
        if (page > this._pageInfo.page) {
          firstOrLast = 'first'
          afterOrBefore = 'after'
          cursor = this._pageInfo.endCursor!
        } else {
          firstOrLast = 'last'
          afterOrBefore = 'before'
          cursor = this._pageInfo.startCursor!
        }
      } else {
        if (page > this._pageInfo.page) {
          firstOrLast = 'last'
          afterOrBefore = 'before'
          cursor = this._pageInfo.startCursor!
        } else {
          firstOrLast = 'first'
          afterOrBefore = 'after'
          cursor = this._pageInfo.endCursor!
        }
      }
    }
    return {
      firstOrLast,
      afterOrBefore,
      cursor,
    }
  }
}
