import {
  User,
  Issue,
  Comment,
} from 'vssue'

export function normalizeUser (user): User {
  return {
    username: user.username,
    avatar: user.links.avatar.href,
    homepage: user.links.html.href,
  }
}

export function normalizeIssue (issue): Issue {
  return {
    id: issue.id,
    title: issue.title,
    content: issue.content.raw,
  }
}

export function normalizeComment (comment: any): Comment {
  return {
    id: comment.id,
    content: comment.content.html,
    contentRaw: comment.content.raw,
    author: normalizeUser(comment.user),
    createdAt: comment.created_on,
    updatedAt: comment.updated_on,
    reactions: null,
  }
}

export default {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
}
