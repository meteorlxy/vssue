import {
  buildURL,
  concatURL,
  getCleanURL,
  parseQuery,
  buildQuery,
  formatDateTime,
  noop,
} from '../src'

test('buildURL', () => {
  expect(buildURL('https://vssue.js.org', {
    'foo': 'foobar',
    'bar': 'barfoo',
  })).toBe('https://vssue.js.org?foo=foobar&bar=barfoo')
})

test('concatURL', () => {
  expect(concatURL('https://vssue.js.org/foo/', '/bar/baz/')).toBe('https://vssue.js.org/foo/bar/baz/')
})

test('getCleanURL', () => {
  expect(getCleanURL('https://vssue.js.org/foo/bar/?foo=foobar&bar=barfoo')).toBe('https://vssue.js.org/foo/bar/')
  expect(getCleanURL('')).toBe('')
})

test('parseQuery', () => {
  expect(parseQuery('?foo=foobar&bar=barfoo')).toMatchObject({
    foo: 'foobar',
    bar: 'barfoo',
  })
})

test('buildQuery', () => {
  expect(buildQuery({
    foo: 'foobar',
    bar: 'barfoo',
  })).toBe('foo=foobar&bar=barfoo')
})

test('formatDateTime', () => {
  expect(formatDateTime('2018-06-23T18:51:17Z')).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
})

test('noop', () => {
  expect(noop()).not.toBeDefined()
})
