import {
  User,
  Issue,
  Comment,
  Reactions,
  VssueAPI,
  VssueAPIOptions,
} from 'vssue'

import {
  buildURL,
  concatURL,
  getCleanURL,
  parseQuery,
} from '@vssue/utils'

import axios, {
  AxiosInstance,
} from 'axios'

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

  get platform () {
    return 'gitlab'
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
      const replaceURL = buildURL(getCleanURL(), query) + window.location.hash
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
    const response = await this.$http.get(`api/v4/projects/${this.repo}/issues`, {
      params: {
        labels: this.labels,
      },
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    const issues = response.data
    return issues.map(normalizeIssue)
  }

  async getComments ({
    issueId,
    accessToken,
  }) {
    const response = await this.$http.get(`api/v4/projects/${this.repo}/issues/${issueId}/notes`, {
      params: {
      },
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    const comments = response.data
    for (const comment of comments) {
      comment.body_html = await this.getMarkdownContent({ contentRaw: comment.body })
    }
    return comments.map(normalizeComment)
  }

  async createIssue ({
    title,
    content,
    accessToken,
  }) {
    const response = await this.$http.post(`api/v4/projects/${this.repo}/issues`, {
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
    const response = await this.$http.post(`api/v4/projects/${this.repo}/issues/${issueId}/notes`, {
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
      await this.$http.post(`api/v4/projects/${this.repo}/issues/${issueId}/award_emoji`, {
        name: normalizeReaction(reaction),
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
      await this.$http.post(`api/v4/projects/${this.repo}/issues/${issueId}/notes/${commentId}/award_emoji`, {
        name: normalizeReaction(reaction),
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

  async getMarkdownContent ({ contentRaw }) {
    const response = await this.$http.post(`api/v4/markdown`, {
      text: contentRaw,
    })
    const content = response.data.html
    return content
  }
}

function normalizeUser (user: any): User {
  return {
    username: user.username,
    avatar: user.avatar_url,
    homepage: user.web_url,
  }
}

function normalizeIssue (issue: any): Issue {
  return {
    id: issue.iid,
    title: issue.title,
    content: issue.description,
    commentsCount: issue.user_notes_count,
  }
}

function normalizeComment (comment: any): Comment {
  return {
    id: comment.id,
    content: comment.body_html,
    contentRaw: comment.body,
    author: normalizeUser(comment.author),
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    reactions: null,
  }
}

function normalizeReaction (reaction: any) {
  if (reaction === '+1') return 'thumbsup'
  if (reaction === '-1') return 'thumbsdown'
  return reaction
}
