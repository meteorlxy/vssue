import { VssueAPI } from 'vssue'
import { concatURL } from '@vssue/utils'

export function normalizeUser (user: any, baseURL: string): VssueAPI.User {
  return {
    username: user.name,
    avatar: concatURL(baseURL, user.avatar),
    homepage: concatURL(baseURL, user.path),
  }
}

export function normalizeIssue (issue: any, baseURL: string): VssueAPI.Issue {
  return {
    id: issue.id,
    title: issue.content,
    content: issue.has_description,
    link: concatURL(baseURL, `${issue.project.project_path}/task/${issue.id}`),
  }
}

export function normalizeComment (comment: any, baseURL: string): VssueAPI.Comment {
  return {
    id: comment.id,
    content: comment.content.html,
    contentRaw: comment.content.raw,
    author: normalizeUser(comment.user, baseURL),
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
