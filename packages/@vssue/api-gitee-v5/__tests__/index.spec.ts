import { VssueAPI } from 'vssue'
import MockAdapter from 'axios-mock-adapter'
import fixtures from './fixtures'
import GiteeV5 from '../src/index'
import {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
} from '../src/utils'

const baseURL = 'https://gitee.com'
const APIEndpoint = 'https://gitee.com/api/v5'

const options = {
  owner: 'owner',
  repo: 'repo',
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  state: 'state',
  labels: fixtures.issue.labels.map(item => item.name),
  proxy: url => `https://porxy/${url}`,
}

const API = new GiteeV5(options)

const mock = new MockAdapter(API.$http)
const mockCode = 'test-code'
const mockToken = 'test-token'

describe('properties', () => {
  test('common properties', () => {
    expect(API.owner).toBe(options.owner)
    expect(API.repo).toBe(options.repo)
    expect(API.clientId).toBe(options.clientId)
    expect(API.clientSecret).toBe(options.clientSecret)
    expect(API.state).toBe(options.state)
    expect(API.labels).toBe(options.labels)
    expect(API.proxy).toBe(options.proxy)
    expect(API.platform.name).toBe('Gitee')
    expect(API.platform.version).toBe('v5')
  })

  test('with default baseURL', () => {
    expect(API.baseURL).toBe(baseURL)
    expect(API.platform.link).toBe(baseURL)
    expect(API.$http.defaults.baseURL).toBe(APIEndpoint)
  })

  test('with custom baseURL', () => {
    const customBaseURL = 'https://github.vssue.com'
    const customAPIEndPoint = `${customBaseURL}/api/v5`
    const customAPI = new GiteeV5({
      baseURL: customBaseURL,
      ...options,
    })
    expect(customAPI.baseURL).toBe(customBaseURL)
    expect(customAPI.platform.link).toBe(customBaseURL)
    expect(customAPI.$http.defaults.baseURL).toBe(customAPIEndPoint)
  })
})

describe('methods', () => {
  afterEach(() => {
    mock.reset()
  })

  test('error', async () => {
    mock.onGet(new RegExp('/error')).reply(400, {
      message: 'error_message',
    })

    await expect(API.$http.get('/error')).rejects.toThrowError('error_message')
  })

  test('redirectAuth', () => {
    // to make `window.location` writable
    const location = window.location
    delete window.location

    const url = 'https://vssue.js.org'
    window.location = <any>{ href: url }
    API.redirectAuth()
    expect(window.location.href).toBe(`${baseURL}/oauth/authorize?client_id=${options.clientId}&redirect_uri=${encodeURIComponent(url)}&scope=user_info%20issues%20notes&response_type=code&state=${options.state}`)

    // reset `window.location`
    window.location = location
  })

  describe('handleAuth', () => {
    beforeEach(() => {
      mock.onPost(new RegExp('/oauth/token')).reply(200, {
        access_token: mockToken,
      })
    })

    test('without code', async () => {
      const url = `https://vssue.js.org/`
      window.history.replaceState(null, '', url)
      const token = await API.handleAuth()
      expect(mock.history.post.length).toBe(0)
      expect(window.location.href).toBe(url)
      expect(token).toBe(null)
    })

    test('with matched state', async () => {
      const url = `https://vssue.js.org/?code=${mockCode}&state=${options.state}`
      window.history.replaceState(null, '', url)
      const token = await API.handleAuth()
      expect(mock.history.post.length).toBe(1)
      expect(window.location.href).toBe('https://vssue.js.org/')
      expect(token).toBe(mockToken)
    })

    test('with unmatched state', async () => {
      const url = `https://vssue.js.org/?code=${mockCode}&state=${options.state}-unmatched`
      window.history.replaceState(null, '', url)
      const token = await API.handleAuth()
      expect(mock.history.post.length).toBe(0)
      expect(window.location.href).toBe(url)
      expect(token).toBe(null)
    })

    describe('getAccessToken', () => {
      test('with function proxy', async () => {
        const token = await API.getAccessToken({ code: mockCode })
        expect(mock.history.post.length).toBe(1)
        const request = mock.history.post[0]
        const data = JSON.parse(request.data)
        expect(request.url).toBe(options.proxy(`${baseURL}/oauth/token`))
        expect(request.method).toBe('post')
        expect(data['client_id']).toBe(options.clientId)
        expect(data['client_secret']).toBe(options.clientSecret)
        expect(data['code']).toBe(mockCode)
        expect(data['grant_type']).toBe('authorization_code')
        expect(data['redirect_uri']).toBe(window.location.href)
        expect(token).toBe(mockToken)
      })

      test('with string proxy', async () => {
        const proxy = `https://string.proxy?target=${baseURL}/oauth/token`
        API.proxy = proxy
        const token = await API.getAccessToken({ code: mockCode })
        expect(mock.history.post.length).toBe(1)
        const request = mock.history.post[0]
        const data = JSON.parse(request.data)
        expect(request.url).toBe(proxy)
        expect(request.method).toBe('post')
        expect(data['client_id']).toBe(options.clientId)
        expect(data['client_secret']).toBe(options.clientSecret)
        expect(data['code']).toBe(mockCode)
        expect(data['grant_type']).toBe('authorization_code')
        expect(data['redirect_uri']).toBe(window.location.href)
        expect(token).toBe(mockToken)
        API.proxy = options.proxy
      })
    })
  })

  test('getUser', async () => {
    mock.onGet(new RegExp('/user$')).reply(200, fixtures.user)
    const user = await API.getUser({ accessToken: mockToken })
    expect(mock.history.get.length).toBe(1)
    const request = mock.history.get[0]
    expect(request.method).toBe('get')
    expect(request.params['access_token']).toBe(mockToken)
    expect(user).toEqual(normalizeUser(fixtures.user))
  })

  describe('getIssue', () => {
    describe('with issue id', () => {
      const issueId = fixtures.issues[0].id

      describe('issue exists', () => {
        beforeEach(() => {
          mock.onGet(new RegExp(`repos/${options.owner}/${options.repo}/issues/${issueId}$`)).reply(200, fixtures.issue)
        })

        test('login', async () => {
          const issue = await API.getIssue({
            issueId,
            accessToken: mockToken,
          }) as VssueAPI.Issue
          expect(mock.history.get.length).toBe(1)
          const request = mock.history.get[0]
          expect(request.method).toBe('get')
          expect(request.params['access_token']).toBe(mockToken)
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
          expect(request.params['access_token']).toBeUndefined()
          expect(issue).toEqual(normalizeIssue(fixtures.issue))
        })
      })

      test('issue does not exist', async () => {
        mock.onGet(new RegExp(`repos/${options.owner}/${options.repo}/issues/${issueId}$`)).reply(404)
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
        mock.onGet(new RegExp(`repos/${options.owner}/${options.repo}/issues/${issueId}$`)).reply(500)
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
      const issueTitle = fixtures.issues[0].title

      describe('issue exists', () => {
        beforeEach(() => {
          mock.onGet(new RegExp(`repos/${options.owner}/${options.repo}/issues$`)).reply(200, fixtures.issues)
        })

        test('login', async () => {
          const issue = await API.getIssue({
            issueTitle,
            accessToken: mockToken,
          }) as VssueAPI.Issue
          expect(mock.history.get.length).toBe(1)
          const request = mock.history.get[0]
          expect(request.method).toBe('get')
          expect(request.params['access_token']).toBe(mockToken)
          expect(issue).toEqual(normalizeIssue(fixtures.issues[0]))
        })

        test('not login', async () => {
          const issue = await API.getIssue({
            issueTitle,
            accessToken: null,
          }) as VssueAPI.Issue
          expect(mock.history.get.length).toBe(1)
          const request = mock.history.get[0]
          expect(request.method).toBe('get')
          expect(request.params['access_token']).toBeUndefined()
          expect(issue).toEqual(normalizeIssue(fixtures.issues[0]))
        })
      })

      test('issue does not exist', async () => {
        mock.onGet(new RegExp(`repos/${options.owner}/${options.repo}/issues$`)).reply(200, [])
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
    const content = fixtures.issue.body
    mock.onPost(new RegExp(`repos/${options.owner}/issues$`)).reply(201, fixtures.issue)
    const issue = await API.postIssue({
      title,
      content,
      accessToken: mockToken,
    }) as VssueAPI.Issue
    expect(mock.history.post.length).toBe(1)
    const request = mock.history.post[0]
    expect(request.method).toBe('post')
    const data = JSON.parse(request.data)
    expect(data['access_token']).toBe(mockToken)
    expect(data['repo']).toBe(options.repo)
    expect(data['title']).toBe(title)
    expect(data['body']).toBe(content)
    expect(data['labels']).toBe(options.labels.join(','))
    expect(issue).toEqual(normalizeIssue(fixtures.issue))
  })

  describe('getComments', () => {
    const issueId = 1

    beforeEach(() => {
      mock
        .onGet(new RegExp(`repos/${options.owner}/${options.repo}/issues/${issueId}$`))
        .reply(200, fixtures.issue)
      mock
        .onGet(new RegExp(`repos/${options.owner}/${options.repo}/issues/${issueId}/comments$`))
        .reply(200, fixtures.comments, { 'total_count': fixtures.comments.length })
    })

    test('login', async () => {
      /* eslint-disable-next-line no-unused-expressions */
      await API.getComments({
        issueId,
        accessToken: mockToken,
      }) as VssueAPI.Comments
      expect(mock.history.get.length).toBe(2)

      const request = mock.history.get[0]
      expect(request.method).toBe('get')
      expect(request.headers['Accept']).toEqual(expect.arrayContaining([
        'application/vnd.gitee.html+json',
      ]))
      expect(request.params['access_token']).toBe(mockToken)
    })

    test('not login', async () => {
      /* eslint-disable-next-line no-unused-expressions */
      await API.getComments({
        issueId,
        accessToken: null,
      }) as VssueAPI.Comments
      expect(mock.history.get.length).toBe(2)

      const request = mock.history.get[0]
      expect(request.method).toBe('get')
      expect(request.params['access_token']).toBeUndefined()
    })

    describe('query', () => {
      const query = {
        page: 1,
        perPage: 10,
      }

      test('common', async () => {
        const comments = await API.getComments({
          issueId,
          accessToken: mockToken,
          query,
        }) as VssueAPI.Comments
        const request = mock.history.get[0]
        expect(request.method).toBe('get')
        expect(request.params['page']).toBe(query.page)
        expect(request.params['per_page']).toBe(query.perPage)
        expect(request.params['sort']).toBeUndefined()
        expect(comments.count).toEqual(fixtures.comments.length)
        expect(comments.page).toEqual(query.page)
        expect(comments.perPage).toEqual(query.perPage)
        expect(comments.data).toEqual(fixtures.comments.slice(0, query.perPage).map(normalizeComment))
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
        expect(request.params['per_page']).toBe(10)
        expect(request.params['sort']).toBeUndefined()
      })
    })
  })

  test('postComment', async () => {
    const issueId = 1
    const content = fixtures.comment.body
    mock.onPost(new RegExp(`repos/${options.owner}/${options.repo}/issues/${issueId}/comments$`)).reply(201, fixtures.comment)
    const comment = await API.postComment({
      issueId,
      content,
      accessToken: mockToken,
    }) as VssueAPI.Comment
    expect(mock.history.post.length).toBe(1)
    const request = mock.history.post[0]
    expect(request.method).toBe('post')
    expect(request.headers['Accept']).toEqual(expect.arrayContaining([
      'application/vnd.gitee.html+json',
    ]))
    const data = JSON.parse(request.data)
    expect(data['access_token']).toBe(mockToken)
    expect(data['body']).toBe(content)
    expect(comment).toEqual(normalizeComment(fixtures.comment))
  })

  test('putComment', async () => {
    const issueId = 1
    const commentId = fixtures.comment.id
    const content = fixtures.comment.body
    mock.onPatch(new RegExp(`repos/${options.owner}/${options.repo}/issues/comments/${commentId}$`)).reply(201, fixtures.comment)
    const comment = await API.putComment({
      issueId,
      commentId,
      content,
      accessToken: mockToken,
    }) as VssueAPI.Comment
    expect(mock.history.patch.length).toBe(1)
    const request = mock.history.patch[0]
    expect(request.method).toBe('patch')
    expect(request.headers['Accept']).toEqual(expect.arrayContaining([
      'application/vnd.gitee.html+json',
    ]))
    const data = JSON.parse(request.data)
    expect(data['access_token']).toBe(mockToken)
    expect(data['body']).toBe(content)
    expect(comment).toEqual(normalizeComment(fixtures.comment))
  })

  test('deleteComment', async () => {
    const issueId = 1
    const commentId = fixtures.comment.id
    mock.onDelete(new RegExp(`repos/${options.owner}/${options.repo}/issues/comments/${commentId}$`)).reply(204)
    const success = await API.deleteComment({
      issueId,
      commentId,
      accessToken: mockToken,
    })
    expect(mock.history.delete.length).toBe(1)
    const request = mock.history.delete[0]
    expect(request.method).toBe('delete')
    expect(request.params['access_token']).toBe(mockToken)
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
