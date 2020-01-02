import {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
  normalizeReactions,
  mapReactionName,
} from '../src/utils';

import fixtures from './fixtures';

test('normalizeUser', () => {
  const user = normalizeUser(fixtures.user);
  expect(user.username).toBe(fixtures.user.login);
  expect(user.avatar).toBe(fixtures.user.avatar_url);
  expect(user.homepage).toBe(fixtures.user.html_url);
});

test('normalizeIssue', () => {
  const issue = normalizeIssue(fixtures.issue);
  expect(issue.id).toBe(fixtures.issue.number);
  expect(issue.title).toBe(fixtures.issue.title);
  expect(issue.content).toBe(fixtures.issue.body);
  expect(issue.link).toBe(fixtures.issue.html_url);
});

test('normalizeComment', () => {
  const comment = normalizeComment(fixtures.comment);
  expect(comment.id).toBe(fixtures.comment.id);
  expect(comment.content).toBe(fixtures.comment.body_html);
  expect(comment.contentRaw).toBe(fixtures.comment.body);
  expect(comment.author).toEqual(normalizeUser(fixtures.comment.user));
  expect(comment.createdAt).toBe(fixtures.comment.created_at);
  expect(comment.updatedAt).toBe(fixtures.comment.updated_at);
  expect(comment.reactions).toEqual(
    normalizeReactions(fixtures.comment.reactions)
  );
});

test('normalizeReactions', () => {
  const reactions = normalizeReactions(fixtures.comment.reactions);
  expect(reactions.like).toBe(fixtures.comment.reactions['+1']);
  expect(reactions.unlike).toBe(fixtures.comment.reactions['-1']);
  expect(reactions.heart).toBe(fixtures.comment.reactions.heart);
});

test('mapReactionName', () => {
  expect(mapReactionName('like')).toBe('+1');
  expect(mapReactionName('unlike')).toBe('-1');
  expect(mapReactionName('heart')).toBe('heart');
});
