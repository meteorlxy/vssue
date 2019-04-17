import { VssueAPI } from 'vssue'
import MockAdapter from 'axios-mock-adapter'
import fixtures from './fixtures'
import BitbucketV2 from '../src/index'
import {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
} from '../src/utils'

const baseURL = 'https://bitbucket.org'
const APIEndpoint = 'https://api.bitbucket.org/2.0'

const options = {
  owner: 'owner',
  repo: 'repo',
  clientId: 'clientId',
  state: 'state',
  labels: [],
}

const API = new BitbucketV2(options)

const mock = new MockAdapter(API.$http)
const mockToken = 'test-token'

describe('properties', () => {
  test('common properties', () => {
    expect(API.owner).toBe(options.owner)
    expect(API.repo).toBe(options.repo)
    expect(API.clientId).toBe(options.clientId)
    expect(API.state).toBe(options.state)
    expect(API.platform.name).toBe('Bitbucket')
    expect(API.platform.version).toBe('v2')
  })

  test('with default baseURL', () => {
    expect(API.baseURL).toBe(baseURL)
    expect(API.platform.link).toBe(baseURL)
    expect(API.$http.defaults.baseURL).toBe(APIEndpoint)
  })
})

describe('methods', () => {
  afterEach(() => {
    mock.reset()
  })

  test('redirectAuth', () => {
    // to make `window.location` writable
    const location = window.location
    delete window.location

    const url = 'https://vssue.js.org'
    window.location = <any>{ href: url }
    API.redirectAuth()
    expect(window.location.href).toBe(`${baseURL}/site/oauth2/authorize?client_id=${options.clientId}&redirect_uri=${encodeURIComponent(url)}&response_type=token&state=${options.state}`)

    // reset `window.location`
    window.location = location
  })

  describe('handleAuth', () => {
    test('without access_token', async () => {
      const url = `https://vssue.js.org/`
      window.history.replaceState(null, '', url)
      const token = await API.handleAuth()
      expect(window.location.href).toBe(url)
      expect(token).toBe(null)
    })

    test('with matched state', async () => {
      const url = `https://vssue.js.org/#access_token=${mockToken}&state=${options.state}`
      window.history.replaceState(null, '', url)
      const token = await API.handleAuth()
      expect(window.location.href).toBe('https://vssue.js.org/')
      expect(token).toBe(mockToken)
    })

    test('with unmatched state', async () => {
      const url = `https://vssue.js.org/#access_token=${mockToken}&state=${options.state}-unmatched`
      window.history.replaceState(null, '', url)
      const token = await API.handleAuth()
      expect(window.location.href).toBe(url)
      expect(token).toBe(null)
    })

    test('with extra hash', async () => {
      const url = `https://vssue.js.org/#access_token=${mockToken}&state=${options.state}&extra=hash`
      window.history.replaceState(null, '', url)
      const token = await API.handleAuth()
      expect(window.location.href).toBe('https://vssue.js.org/#extra=hash')
      expect(token).toBe(mockToken)
    })
  })

  test('getUser', async () => {
    mock.onGet(new RegExp('/user$')).reply(200, fixtures.user)
    const user = await API.getUser({ accessToken: mockToken })
    expect(mock.history.get.length).toBe(1)
    const request = mock.history.get[0]
    expect(request.method).toBe('get')
    expect(request.headers['Authorization']).toBe(`Bearer ${mockToken}`)
    expect(user).toEqual(normalizeUser(fixtures.user))
  })

  describe('getIssue', () => {
    describe('with issue id', () => {
      const issueId = fixtures.issues.values[0].id

      describe('issue exists', () => {
        beforeEach(() => {
          mock.onGet(new RegExp(`repositories/${options.owner}/${options.repo}/issues/${issueId}$`)).reply(200, fixtures.issue)
        })

        test('login', async () => {
          const issue = await API.getIssue({
            issueId,
            accessToken: mockToken,
          }) as VssueAPI.Issue
          expect(mock.history.get.length).toBe(1)
          const request = mock.history.get[0]
          expect(request.method).toBe('get')
          expect(request.headers['Authorization']).toBe(`Bearer ${mockToken}`)
          expect(issue).toEqual(normalizeIssue(fixtures.issue))
        })

        test('not login', async () => {
          const issue = await API.getIssue({
            issueId,
            accessToken: null,
          }) as VssueAPI.Issue
          expect(mock.history.get.length).toBe(1)
          const request = mock.history.get[0]
          expect(request.method).toBe('get')
          expect(request.headers['Authorization']).toBeUndefined()
          expect(issue).toEqual(normalizeIssue(fixtures.issue))
        })
      })

      test('issue does not exist', async () => {
        mock.onGet(new RegExp(`repositories/${options.owner}/${options.repo}/issues/${issueId}$`)).reply(404)
        const issue = await API.getIssue({
          issueId,
          accessToken: null,
        })
        expect(mock.history.get.length).toBe(1)
        const request = mock.history.get[0]
        expect(request.method).toBe('get')
        expect(issue).toBe(null)
      })

      test('error', async () => {
        mock.onGet(new RegExp(`repositories/${options.owner}/${options.repo}/issues/${issueId}$`)).reply(500)
        await expect(API.getIssue({
          issueId,
          accessToken: null,
        })).rejects.toThrow()
        expect(mock.history.get.length).toBe(1)
        const request = mock.history.get[0]
        expect(request.method).toBe('get')
      })
    })

    describe('with issue title', () => {
      const issueTitle = fixtures.issues.values[0].title

      describe('issue exists', () => {
        beforeEach(() => {
          mock.onGet(new RegExp(`repositories/${options.owner}/${options.repo}/issues$`)).reply(200, fixtures.issues)
        })

        test('login', async () => {
          const issue = await API.getIssue({
            issueTitle,
            accessToken: mockToken,
          }) as VssueAPI.Issue
          expect(mock.history.get.length).toBe(1)
          const request = mock.history.get[0]
          expect(request.method).toBe('get')
          expect(request.headers['Authorization']).toBe(`Bearer ${mockToken}`)
          expect(issue).toEqual(normalizeIssue(fixtures.issues.values[0]))
        })

        test('not login', async () => {
          const issue = await API.getIssue({
            issueTitle,
            accessToken: null,
          }) as VssueAPI.Issue
          expect(mock.history.get.length).toBe(1)
          const request = mock.history.get[0]
          expect(request.method).toBe('get')
          expect(request.headers['Authorization']).toBeUndefined()
          expect(issue).toEqual(normalizeIssue(fixtures.issues.values[0]))
        })
      })

      test('issue does not exist', async () => {
        mock.onGet(new RegExp(`repositories/${options.owner}/${options.repo}/issues$`)).reply(200, [])
        const issue = await API.getIssue({
          issueTitle,
          accessToken: null,
        })
        expect(mock.history.get.length).toBe(1)
        const request = mock.history.get[0]
        expect(request.method).toBe('get')
        expect(issue).toBe(null)
      })
    })
  })

  test('postIssue', async () => {
    const title = fixtures.issue.title
    const content = fixtures.issue.content.raw
    mock.onPost(new RegExp(`repositories/${options.owner}/${options.repo}/issues$`)).reply(201, fixtures.issue)
    const issue = await API.postIssue({
      title,
      content,
      accessToken: mockToken,
    }) as VssueAPI.Issue
    expect(mock.history.post.length).toBe(1)
    const request = mock.history.post[0]
    expect(request.method).toBe('post')
    expect(request.headers['Authorization']).toBe(`Bearer ${mockToken}`)
    expect(issue).toEqual(normalizeIssue(fixtures.issue))
  })

  describe('getComments', () => {
    const issueId = 1

    beforeEach(() => {
      mock
        .onGet(new RegExp(`repositories/${options.owner}/${options.repo}/issues/${issueId}/comments$`))
        .reply(200, fixtures.comments, { 'link': null })
    })

    test('login', async () => {
      /* eslint-disable-next-line no-unused-expressions */
      await API.getComments({
        issueId,
        accessToken: mockToken,
      }) as VssueAPI.Comments
      expect(mock.history.get.length).toBe(1)

      const request = mock.history.get[0]
      expect(request.method).toBe('get')
      expect(request.headers['Authorization']).toBe(`Bearer ${mockToken}`)
    })

    test('not login', async () => {
      /* eslint-disable-next-line no-unused-expressions */
      await API.getComments({
        issueId,
        accessToken: null,
      }) as VssueAPI.Comments
      expect(mock.history.get.length).toBe(1)

      const request = mock.history.get[0]
      expect(request.method).toBe('get')
      expect(request.headers['Authorization']).toBeUndefined()
    })

    describe('query', () => {
      const query = {
        page: fixtures.comments.page,
        perPage: fixtures.comments.pagelen,
        sort: 'desc',
      }

      test('common', async () => {
        const comments = await API.getComments({
          issueId,
          accessToken: mockToken,
          query,
        }) as VssueAPI.Comments
        const request = mock.history.get[0]
        expect(request.params['page']).toBe(query.page)
        expect(request.params['pagelen']).toBe(query.perPage)
        expect(request.params['sort']).toBe('-created_on')
        expect(comments.count).toEqual(fixtures.comments.values.length)
        expect(comments.page).toEqual(query.page)
        expect(comments.perPage).toEqual(query.perPage)
        expect(comments.data).toEqual(fixtures.comments.values.slice(0, query.perPage).map(normalizeComment))
      })

      test('default value', async () => {
        /* eslint-disable-next-line no-unused-expressions */
        await API.getComments({
          issueId,
          accessToken: mockToken,
          query: {},
        }) as VssueAPI.Comments
        const request = mock.history.get[0]
        expect(request.params['page']).toBe(1)
        expect(request.params['pagelen']).toBe(10)
        expect(request.params['sort']).toBe('-created_on')
      })

      test('sort asc', async () => {
        /* eslint-disable-next-line no-unused-expressions */
        await API.getComments({
          issueId,
          accessToken: mockToken,
          query: {
            sort: 'asc',
          },
        }) as VssueAPI.Comments
        const request = mock.history.get[0]
        expect(request.params['sort']).toBe('created_on')
      })
    })
  })

  test('postComment', async () => {
    const issueId = 1
    const content = fixtures.comment.content.raw
    mock.onPost(new RegExp(`repositories/${options.owner}/${options.repo}/issues/${issueId}/comments$`)).reply(201, fixtures.comment)
    const comment = await API.postComment({
      issueId,
      content,
      accessToken: mockToken,
    }) as VssueAPI.Comment
    expect(mock.history.post.length).toBe(1)
    const request = mock.history.post[0]
    expect(request.method).toBe('post')
    expect(request.headers['Authorization']).toBe(`Bearer ${mockToken}`)
    expect(comment).toEqual(normalizeComment(fixtures.comment))
  })

  test('putComment', async () => {
    const issueId = 1
    const commentId = fixtures.comment.id
    const content = fixtures.comment.content.raw
    mock.onPut(new RegExp(`repositories/${options.owner}/${options.repo}/issues/${issueId}/comments/${commentId}$`)).reply(201, fixtures.comment)
    const comment = await API.putComment({
      issueId,
      commentId,
      content,
      accessToken: mockToken,
    }) as VssueAPI.Comment
    expect(mock.history.put.length).toBe(1)
    const request = mock.history.put[0]
    expect(request.method).toBe('put')
    expect(request.headers['Authorization']).toBe(`Bearer ${mockToken}`)
    expect(comment).toEqual(normalizeComment(fixtures.comment))
  })

  test('deleteComment', async () => {
    const issueId = 1
    const commentId = fixtures.comment.id
    mock.onDelete(new RegExp(`repositories/${options.owner}/${options.repo}/issues/${issueId}/comments/${commentId}$`)).reply(204)
    const success = await API.deleteComment({
      issueId,
      commentId,
      accessToken: mockToken,
    })
    expect(mock.history.delete.length).toBe(1)
    const request = mock.history.delete[0]
    expect(request.method).toBe('delete')
    expect(request.headers['Authorization']).toBe(`Bearer ${mockToken}`)
    expect(success).toBe(true)
  })

  test('getCommentReactions', async () => {
    const issueId = 1
    const commentId = fixtures.comment.id
    await expect(API.getCommentReactions({
      issueId,
      commentId,
      accessToken: mockToken,
    })).rejects.toThrowError('501 Not Implemented')
  })

  test('postCommentReaction', async () => {
    const issueId = 1
    const commentId = fixtures.comment.id
    await expect(API.postCommentReaction({
      issueId,
      commentId,
      accessToken: mockToken,
      reaction: 'like',
    })).rejects.toThrowError('501 Not Implemented')
  })
})
