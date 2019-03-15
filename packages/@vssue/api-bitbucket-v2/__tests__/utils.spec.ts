import {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
} from '../src/utils'

import fixtures from './fixtures'

test('normalizeUser', () => {
  const user = normalizeUser(fixtures.user)
  expect(user.username).toBe(fixtures.user.username)
  expect(user.avatar).toBe(fixtures.user.links.avatar.href)
  expect(user.homepage).toBe(fixtures.user.links.html.href)
})

test('normalizeIssue', () => {
  const issue = normalizeIssue(fixtures.issue)
  expect(issue.id).toBe(fixtures.issue.id)
  expect(issue.title).toBe(fixtures.issue.title)
  expect(issue.content).toBe(fixtures.issue.content.raw)
  expect(issue.link).toBe(fixtures.issue.links.html.href)
})

test('normalizeComment', () => {
  const comment = normalizeComment(fixtures.comment)
  expect(comment.id).toBe(fixtures.comment.id)
  expect(comment.content).toBe(fixtures.comment.content.html)
  expect(comment.contentRaw).toBe(fixtures.comment.content.raw)
  expect(comment.author).toEqual(normalizeUser(fixtures.comment.user))
  expect(comment.createdAt).toBe(fixtures.comment.created_on)
  expect(comment.updatedAt).toBe(fixtures.comment.updated_on)
  expect(comment.reactions).toBe(null)
})
