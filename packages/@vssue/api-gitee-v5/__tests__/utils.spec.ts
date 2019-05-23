import {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
} from '../src/utils'

import fixtures from './fixtures'

test('normalizeUser', () => {
  const user = normalizeUser(fixtures.user)
  expect(user.username).toBe(fixtures.user.login)
  expect(user.avatar).toBe(fixtures.user.avatar_url)
  expect(user.homepage).toBe(fixtures.user.html_url)
})

test('normalizeIssue', () => {
  const issue = normalizeIssue(fixtures.issue)
  expect(issue.id).toBe(fixtures.issue.number)
  expect(issue.title).toBe(fixtures.issue.title)
  expect(issue.content).toBe(fixtures.issue.body)
  expect(issue.link).toBe(fixtures.issue.html_url)
})

test('normalizeComment', () => {
  const comment = normalizeComment(fixtures.comment)
  expect(comment.id).toBe(fixtures.comment.id)
  expect(comment.content).toBeUndefined()
  expect(comment.contentRaw).toBe(fixtures.comment.body)
  expect(comment.author).toEqual(normalizeUser(fixtures.comment.user))
  expect(comment.createdAt).toBe(fixtures.comment.created_at)
  expect(comment.updatedAt).toBeUndefined()
  expect(comment.reactions).toBe(null)
})
