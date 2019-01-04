import {
  User,
  Issue,
  Comment,
  Reactions,
} from 'vssue'

export function normalizeUser (user: any): User {
  return {
    username: user.username,
    avatar: user.avatar_url,
    homepage: user.web_url,
  }
}

export function normalizeIssue (issue: any): Issue {
  return {
    id: issue.iid,
    title: issue.title,
    content: issue.description,
  }
}

export function normalizeComment (comment: any): Comment {
  return {
    id: comment.id,
    content: comment.body_html,
    contentRaw: comment.body,
    author: normalizeUser(comment.author),
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    reactions: comment.reactions,
  }
}

export function normalizeReactions (reactions: any): Reactions {
  return {
    like: reactions.filter(item => item.name === 'thumbsup').length,
    unlike: reactions.filter(item => item.name === 'thumbsdown').length,
    heart: reactions.filter(item => item.name === 'heart').length,
  }
}

export function mapReactionName (reaction: any) {
  if (reaction === 'like') return 'thumbsup'
  if (reaction === 'unlike') return 'thumbsdown'
  return reaction
}

export default {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
  normalizeReactions,
  mapReactionName,
}
