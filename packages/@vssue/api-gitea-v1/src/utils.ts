import { VssueAPI } from 'vssue';
import { concatURL } from '@vssue/utils';
import {
  ResponseUser,
  ResponseIssue,
  ResponseComment,
  ResponseReaction,
} from './types';

export function normalizeUser(
  user: ResponseUser,
  baseURL: string
): VssueAPI.User {
  return {
    username: user.login,
    avatar: user.avatar_url,
    homepage: concatURL(baseURL, user.login),
  };
}

export function normalizeIssue(
  issue: ResponseIssue,
  baseURL: string,
  owner: string,
  repo: string
): VssueAPI.Issue {
  return {
    id: issue.number,
    title: issue.title,
    content: issue.body,
    link: concatURL(baseURL, `${owner}/${repo}/issues/${issue.number}`),
  };
}

export function normalizeComment(
  comment: ResponseComment,
  baseURL: string
): VssueAPI.Comment {
  return {
    id: comment.id,
    content: comment.body_html || '',
    contentRaw: comment.body,
    author: normalizeUser(comment.user, baseURL),
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    reactions: comment.reactions as VssueAPI.Reactions,
  };
}

export function normalizeReactions(
  reactions: ResponseReaction[]
): VssueAPI.Reactions {
  return {
    like: reactions.filter(item => item.content === '+1').length,
    unlike: reactions.filter(item => item.content === '-1').length,
    heart: reactions.filter(item => item.content === 'heart').length,
  };
}

export function mapReactionName(reaction: keyof VssueAPI.Reactions): string {
  if (reaction === 'like') return '+1';
  if (reaction === 'unlike') return '-1';
  return reaction;
}

export default {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
};
