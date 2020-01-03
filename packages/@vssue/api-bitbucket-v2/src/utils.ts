import { VssueAPI } from 'vssue';
import { ResponseUser, ResponseIssue, ResponseComment } from './types';

export function normalizeUser(user: ResponseUser): VssueAPI.User {
  return {
    username: user.nickname,
    avatar: user.links.avatar.href,
    homepage: user.links.html.href,
  };
}

export function normalizeIssue(issue: ResponseIssue): VssueAPI.Issue {
  return {
    id: issue.id,
    title: issue.title,
    content: issue.content.raw,
    link: issue.links.html.href,
  };
}

export function normalizeComment(comment: ResponseComment): VssueAPI.Comment {
  return {
    id: comment.id,
    content: comment.content.html,
    contentRaw: comment.content.raw,
    author: normalizeUser(comment.user),
    createdAt: comment.created_on,
    updatedAt: comment.updated_on,
    reactions: null,
  };
}

export default {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
};
