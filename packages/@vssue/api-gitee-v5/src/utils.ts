import { VssueAPI } from 'vssue'

export function normalizeUser (user: any): VssueAPI.User {
  return {
    username: user.login,
    avatar: user.avatar_url,
    homepage: user.html_url,
  }
}

export function normalizeIssue (issue: any): VssueAPI.Issue {
  return {
    id: issue.number,
    title: issue.title,
    content: issue.body,
    link: issue.html_url,
  }
}

export function normalizeComment (comment: any): VssueAPI.Comment {
  return {
    id: comment.id,
    content: comment.body_html,
    contentRaw: comment.body,
    author: normalizeUser(comment.user),
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    reactions: null,
  }
}

export default {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
}
