import {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
  normalizeReactions,
  mapReactionName,
} from '../src/utils'

import fixtures from './fixtures'

test('normalizeUser', () => {
  const user = normalizeUser(fixtures.user)
  expect(user.username).toBe(fixtures.user.username)
  expect(user.avatar).toBe(fixtures.user.avatar_url)
  expect(user.homepage).toBe(fixtures.user.web_url)
})

test('normalizeIssue', () => {
  const issue = normalizeIssue(fixtures.issue)
  expect(issue.id).toBe(fixtures.issue.iid)
  expect(issue.title).toBe(fixtures.issue.title)
  expect(issue.content).toBe(fixtures.issue.description)
  expect(issue.link).toBe(fixtures.issue.web_url)
})

test('normalizeComment', () => {
  const comment = normalizeComment(fixtures.comment)
  expect(comment.id).toBe(fixtures.comment.id)
  expect(comment.content).toBeUndefined()
  expect(comment.contentRaw).toBe(fixtures.comment.body)
  expect(comment.author).toEqual(normalizeUser(fixtures.comment.author))
  expect(comment.createdAt).toBe(fixtures.comment.created_at)
  expect(comment.updatedAt).toBe(fixtures.comment.updated_at)
  expect(comment.reactions).toBeUndefined()
})

test('normalizeReactions', () => {
  const reactions = normalizeReactions(fixtures.reactions)
  expect(reactions.like).toBe(fixtures.reactions.filter(item => item.name === 'thumbsup').length)
  expect(reactions.unlike).toBe(fixtures.reactions.filter(item => item.name === 'thumbsdown').length)
  expect(reactions.heart).toBe(fixtures.reactions.filter(item => item.name === 'heart').length)
})

test('mapReactionName', () => {
  expect(mapReactionName('like')).toBe('thumbsup')
  expect(mapReactionName('unlike')).toBe('thumbsdown')
  expect(mapReactionName('heart')).toBe('heart')
})
