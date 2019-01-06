import {
  User,
  Issue,
  Comment,
  Reactions,
} from 'vssue'

export function normalizeUser (user: any): User {
  return {
    username: user.login,
    avatar: user.avatar_url,
    homepage: user.html_url,
  }
}

export function normalizeIssue (issue: any): Issue {
  return {
    id: issue.number,
    title: issue.title,
    content: issue.body,
  }
}

export function normalizeComment (comment: any): Comment {
  return {
    id: comment.id,
    content: comment.body_html,
    contentRaw: comment.body,
    author: normalizeUser(comment.user),
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    reactions: normalizeReactions(comment.reactions),
  }
}

export function normalizeReactions (reactions: any): Reactions {
  return {
    like: reactions['+1'],
    unlike: reactions['-1'],
    heart: reactions['heart'],
  }
}

export function mapReactionName (reaction: string): string {
  if (reaction === 'like') return '+1'
  if (reaction === 'unlike') return '-1'
  return reaction
}

export default {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
  normalizeReactions,
  mapReactionName,
}
