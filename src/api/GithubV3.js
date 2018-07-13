import axios from 'axios'
import { getCleanURL, buildURL, parseQuery } from '../utils'

/**
 * Github API v3
 *
 * @see https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
 * @see https://developer.github.com/v3/issues/
 * @see https://developer.github.com/v3/issues/comments/
 * @see https://developer.github.com/v3/reactions/
 */
export default class GithubV3 {
  constructor ({
    owner,
    repo,
    labels,
    clientId,
    clientSecret,
    state
  }) {
    this.owner = owner
    this.repo = repo
    this.labels = labels

    this.clientId = clientId
    this.clientSecret = clientSecret
    this.state = state

    this.$http = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })

    this.$http.interceptors.response.use(function (response) {
      if (response.data.error) {
        return Promise.reject(response.data.error_description)
      }
      return response
    })
  }

  redirectAuthorize () {
    window.location.href = buildURL('https://github.com/login/oauth/authorize', {
      client_id: this.clientId,
      redirect_uri: window.location.href,
      scope: 'public_repo',
      state: this.state
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
      window.history.replaceState(null, null, replaceURL)
      const accessToken = await this.getAccessToken({ code })
      return accessToken
    }
    return null
  }

  async getAccessToken ({ code }) {
    /**
     * access_token api does not support cors
     * @see https://github.com/isaacs/github/issues/330
     */
    const response = await this.$http.post(`https://cors-anywhere.herokuapp.com/${'https://github.com/login/oauth/access_token'}`, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code
      /**
       * useless but mentioned in docs
       * @see https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#2-users-are-redirected-back-to-your-site-by-github
       */
      // redirect_uri: window.location.href,
      // state: this.state
    }, {
      headers: {
        'Accept': 'application/json'
      }
    })
    const accessToken = response.data.access_token
    return accessToken
  }

  async getUser ({ accessToken }) {
    const response = await this.$http.get('/user', {
      headers: { 'Authorization': `token ${accessToken}` }
    })
    const user = response.data
    return normalizeUser(user)
  }

  async getIssues ({ accessToken }) {
    const response = await this.$http.get(`repos/${this.owner}/${this.repo}/issues`, {
      params: {
        labels: this.labels,
        // to avoid caching
        timestamp: Date.now()
      },
      headers: {
        'Authorization': `token ${accessToken}`
      }
    })
    const issues = response.data
    return issues.map(normalizeIssue)
  }

  async getComments ({ issueId, accessToken }) {
    const response = await this.$http.get(`repos/${this.owner}/${this.repo}/issues/${issueId}/comments`, {
      params: {
        // to avoid caching
        timestamp: Date.now()
      },
      headers: {
        'Accept': [
          'application/vnd.github.v3.raw+json',
          'application/vnd.github.v3.html+json',
          'application/vnd.github.squirrel-girl-preview'
        ],
        'Authorization': `token ${accessToken}`
      }
    })
    const comments = response.data
    return comments.map(normalizeComment)
  }

  async createIssue ({
    title,
    content,
    accessToken
  }) {
    const response = await this.$http.post(`repos/${this.owner}/${this.repo}/issues`, {
      title,
      body: content,
      labels: this.labels.split(',')
    }, {
      headers: { 'Authorization': `token ${accessToken}` }
    })
    const issue = response.data
    return normalizeIssue(issue)
  }

  async createIssueComment ({
    issueId,
    content,
    accessToken
  }) {
    const response = await this.$http.post(`repos/${this.owner}/${this.repo}/issues/${issueId}/comments`, {
      body: content
    }, {
      headers: { 'Authorization': `token ${accessToken}` }
    })
    const comment = response.data
    return normalizeComment(comment)
  }

  async createIssueReaction ({
    issueId,
    reaction,
    accessToken
  }) {
    try {
      await this.$http.post(`repos/${this.owner}/${this.repo}/issues/${issueId}/reactions`, {
        content: reaction
      }, {
        headers: { 'Authorization': `token ${accessToken}` }
      })
      return true
    } catch (e) {
      return false
    }
  }

  async createCommentReaction ({
    commentId,
    reaction,
    accessToken
  }) {
    try {
      await this.$http.post(`repos/${this.owner}/${this.repo}/issues/comments/${commentId}/reactions`, {
        content: reaction
      }, {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.squirrel-girl-preview'
        }
      })
      return true
    } catch (e) {
      return false
    }
  }
}

function normalizeUser (user) {
  return {
    username: user.login,
    avatar: user.avatar_url,
    homepage: user.html_url
  }
}

function normalizeIssue (issue) {
  return {
    id: issue.number,
    title: issue.title,
    content: issue.body,
    commentsCount: issue.comments
  }
}

function normalizeComment (comment) {
  return {
    id: comment.id,
    content: comment.body_html,
    contentRaw: comment.body,
    author: normalizeUser(comment.user),
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    reactions: comment.reactions
  }
}
