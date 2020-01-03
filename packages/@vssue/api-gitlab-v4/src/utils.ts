import { VssueAPI } from 'vssue';

import {
  ResponseUser,
  ResponseIssue,
  ResponseComment,
  ResponseReaction,
} from './types';

export function normalizeUser(user: ResponseUser): VssueAPI.User {
  return {
    username: user.username,
    avatar: user.avatar_url,
    homepage: user.web_url,
  };
}

export function normalizeIssue(issue: ResponseIssue): VssueAPI.Issue {
  return {
    id: issue.iid,
    title: issue.title,
    content: issue.description,
    link: issue.web_url,
  };
}

export function normalizeComment(comment: ResponseComment): VssueAPI.Comment {
  return {
    id: comment.id,
    content: comment.body_html,
    contentRaw: comment.body,
    author: normalizeUser(comment.author),
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    reactions: comment.reactions as VssueAPI.Reactions,
  };
}

export function normalizeReactions(
  reactions: ResponseReaction[]
): VssueAPI.Reactions {
  return {
    like: reactions.filter(item => item.name === 'thumbsup').length,
    unlike: reactions.filter(item => item.name === 'thumbsdown').length,
    heart: reactions.filter(item => item.name === 'heart').length,
  };
}

export function mapReactionName(reaction: keyof VssueAPI.Reactions): string {
  if (reaction === 'like') return 'thumbsup';
  if (reaction === 'unlike') return 'thumbsdown';
  return reaction;
}

export default {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
  normalizeReactions,
  mapReactionName,
};
