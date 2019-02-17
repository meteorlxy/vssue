import { VssueAPI } from 'vssue'

export function normalizeUser (user: any): VssueAPI.User {
  return {
    username: user.login,
    avatar: user.avatarUrl,
    homepage: user.url,
  }
}

export function normalizeIssue (issue: any): VssueAPI.Issue {
  return {
    id: issue.number,
    title: issue.title,
    content: issue.body,
    link: issue.url,
  }
}

export function normalizeComment (comment: any): VssueAPI.Comment {
  return {
    id: comment.id,
    content: comment.bodyHTML,
    contentRaw: comment.body,
    author: normalizeUser(comment.author),
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    reactions: normalizeReactions(comment.reactionGroups),
  }
}

export function normalizeReactions (reactions: any): VssueAPI.Reactions {
  return {
    like: reactions.find(item => item.content === 'THUMBS_UP').users.totalCount,
    unlike: reactions.find(item => item.content === 'THUMBS_DOWN').users.totalCount,
    heart: reactions.find(item => item.content === 'HEART').users.totalCount,
  }
}

export function mapReactionName (reaction: keyof VssueAPI.Reactions): string {
  if (reaction === 'like') return 'THUMBS_UP'
  if (reaction === 'unlike') return 'THUMBS_DOWN'
  if (reaction === 'heart') return 'HEART'
  return reaction
}

export default {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
  normalizeReactions,
  mapReactionName,
}
