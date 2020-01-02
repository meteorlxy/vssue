import { VssueAPI } from 'vssue';

export function normalizeUser(user: any): VssueAPI.User {
  return {
    username: user.login,
    avatar: user.avatar_url,
    homepage: user.html_url,
  };
}

export function normalizeIssue(issue: any): VssueAPI.Issue {
  return {
    id: issue.number,
    title: issue.title,
    content: issue.body,
    link: issue.html_url,
  };
}

export function normalizeReactions(reactions: any): VssueAPI.Reactions {
  return {
    like: reactions['+1'],
    unlike: reactions['-1'],
    heart: reactions.heart,
  };
}

export function normalizeComment(comment: any): VssueAPI.Comment {
  return {
    id: comment.id,
    content: comment.body_html,
    contentRaw: comment.body,
    author: normalizeUser(comment.user),
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
    reactions: normalizeReactions(comment.reactions),
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
  normalizeReactions,
  mapReactionName,
};
