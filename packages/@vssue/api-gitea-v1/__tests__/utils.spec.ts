import {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
  normalizeReactions,
  mapReactionName,
} from '../src/utils';

import fixtures from './fixtures';

const baseURL = 'https://gitea.com';
const owner = 'meteorlxy';
const repo = 'vssue';

test('normalizeUser', () => {
  const user = normalizeUser(fixtures.user, baseURL);
  expect(user.username).toBe(fixtures.user.login);
  expect(user.avatar).toBe(fixtures.user.avatar_url);
  expect(user.homepage).toBe(`${baseURL}/${fixtures.user.login}`);
});

test('normalizeIssue', () => {
  const issue = normalizeIssue(fixtures.issue, baseURL, owner, repo);
  expect(issue.id).toBe(fixtures.issue.number);
  expect(issue.title).toBe(fixtures.issue.title);
  expect(issue.content).toBe(fixtures.issue.body);
  expect(issue.link).toBe(
    `${baseURL}/${owner}/${repo}/issues/${fixtures.issue.number}`
  );
});

test('normalizeComment', () => {
  const comment = normalizeComment(fixtures.comment, baseURL);
  expect(comment.id).toBe(fixtures.comment.id);
  expect(comment.content).toBe('');
  expect(comment.contentRaw).toBe(fixtures.comment.body);
  expect(comment.author).toEqual(normalizeUser(fixtures.comment.user, baseURL));
  expect(comment.createdAt).toBe(fixtures.comment.created_at);
  expect(comment.updatedAt).toBe(fixtures.comment.updated_at);
  expect(comment.reactions).toBeUndefined();
});

test('normalizeReactions', () => {
  const reactions = normalizeReactions(fixtures.reactions);
  expect(reactions.like).toBe(
    fixtures.reactions.filter(item => item.content === '+1').length
  );
  expect(reactions.unlike).toBe(
    fixtures.reactions.filter(item => item.content === '-1').length
  );
  expect(reactions.heart).toBe(
    fixtures.reactions.filter(item => item.content === 'heart').length
  );
});

test('mapReactionName', () => {
  expect(mapReactionName('like')).toBe('+1');
  expect(mapReactionName('unlike')).toBe('-1');
  expect(mapReactionName('heart')).toBe('heart');
});
