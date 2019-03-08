import { VssueAPI } from 'vssue'
import GithubV3 from '@vssue/api-github-v3'
import MockAdapter from 'axios-mock-adapter'
import fixtures from './fixtures'

const baseURL = 'https://github.com'
const APIEndpoint = 'https://api.github.com'

const options = {
  owner: 'owner',
  repo: 'repo',
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  state: 'state',
  labels: fixtures.issue.labels.map(item => item.name),
  proxy: url => `https://porxy/${url}`,
}

const API = new GithubV3(options)

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
    expect(API.platform.name).toBe('GitHub')
    expect(API.platform.version).toBe('v3')
  })

  test('with default baseURL', () => {
    expect(API.baseURL).toBe(baseURL)
    expect(API.platform.link).toBe(baseURL)
    expect(API.$http.defaults.baseURL).toBe(APIEndpoint)
  })

  test('with custom baseURL', () => {
    const customBaseURL = 'https://github.vssue.com'
    const customAPIEndPoint = `${customBaseURL}/api/v3`
    const customAPI = new GithubV3({
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

  test('redirectAuth', () => {
    // to make `window.location` writable
    const location = window.location
    delete window.location

    const url = 'https://vssue.js.org'
    window.location = <any>{ href: url }
    API.redirectAuth()
    expect(window.location.href).toBe(`${baseURL}/login/oauth/authorize?client_id=${options.clientId}&redirect_uri=${encodeURIComponent(url)}&scope=public_repo&state=${options.state}`)

    // reset `window.location`
    window.location = location
  })

  describe('handleAuth', () => {
    beforeEach(() => {
      mock.onPost(new RegExp('login/oauth/access_token')).reply(200, {
        access_token: mockToken,
      })
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
        expect(request.url).toBe(options.proxy('https://github.com/login/oauth/access_token'))
        expect(request.method).toBe('post')
        expect(data['client_id']).toBe(options.clientId)
        expect(data['client_secret']).toBe(options.clientSecret)
        expect(data['code']).toBe(mockCode)
        expect(token).toBe(mockToken)
      })

      test('with string proxy', async () => {
        const proxy = 'https://string.proxy?target=https://github.com/login/oauth/access_token'
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
    expect(request.headers['Authorization']).toBe(`token ${mockToken}`)
    expect(user.username).toBe(fixtures.user.login)
    expect(user.avatar).toBe(fixtures.user.avatar_url)
    expect(user.homepage).toBe(fixtures.user.html_url)
  })

  describe('getIssue', () => {
    describe('with issue id', () => {
      const issueId = fixtures.issues[0].id

      beforeEach(() => {
        mock.onGet(new RegExp(`repos/${options.owner}/${options.repo}/issues/${issueId}`)).reply(200, fixtures.issue)
      })

      test('login', async () => {
        const issue = await API.getIssue({
          issueId,
          accessToken: mockToken,
        }) as VssueAPI.Issue
        expect(mock.history.get.length).toBe(1)
        const request = mock.history.get[0]
        expect(request.method).toBe('get')
        expect(request.headers['Authorization']).toBe(`token ${mockToken}`)
        expect(issue.id).toBe(fixtures.issue.number)
        expect(issue.title).toBe(fixtures.issue.title)
        expect(issue.content).toBe(fixtures.issue.body)
        expect(issue.link).toBe(fixtures.issue.html_url)
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
        expect(issue.id).toBe(fixtures.issue.number)
        expect(issue.title).toBe(fixtures.issue.title)
        expect(issue.content).toBe(fixtures.issue.body)
        expect(issue.link).toBe(fixtures.issue.html_url)
      })
    })

    describe('with issue title', () => {
      const issueTitle = fixtures.issues[0].title

      beforeEach(() => {
        mock.onGet(new RegExp(`repos/${options.owner}/${options.repo}/issues`)).reply(200, fixtures.issues)
      })

      test('login', async () => {
        const issue = await API.getIssue({
          issueTitle,
          accessToken: mockToken,
        }) as VssueAPI.Issue
        expect(mock.history.get.length).toBe(1)
        const request = mock.history.get[0]
        expect(request.method).toBe('get')
        expect(request.headers['Authorization']).toBe(`token ${mockToken}`)
        expect(issue.id).toBe(fixtures.issues[0].number)
        expect(issue.title).toBe(fixtures.issues[0].title)
        expect(issue.content).toBe(fixtures.issues[0].body)
        expect(issue.link).toBe(fixtures.issues[0].html_url)
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
        expect(issue.id).toBe(fixtures.issues[0].number)
        expect(issue.title).toBe(fixtures.issues[0].title)
        expect(issue.content).toBe(fixtures.issues[0].body)
        expect(issue.link).toBe(fixtures.issues[0].html_url)
      })
    })
  })

  test('postIssue', async () => {
    const title = fixtures.issue.title
    const content = fixtures.issue.body
    mock.onPost(new RegExp(`repos/${options.owner}/${options.repo}/issues`)).reply(201, fixtures.issue)
    const issue = await API.postIssue({
      title,
      content,
      accessToken: mockToken,
    }) as VssueAPI.Issue
    expect(mock.history.post.length).toBe(1)
    const request = mock.history.post[0]
    expect(request.method).toBe('post')
    expect(request.headers['Authorization']).toBe(`token ${mockToken}`)
    expect(issue.id).toBe(fixtures.issue.number)
    expect(issue.title).toBe(fixtures.issue.title)
    expect(issue.content).toBe(fixtures.issue.body)
    expect(issue.link).toBe(fixtures.issue.html_url)
  })

  describe('getComments', () => {
    const issueId = 1
    const query = {
      page: 1,
      perPage: 10,
    }

    beforeEach(() => {
      mock
        .onGet(new RegExp(`repos/${options.owner}/${options.repo}/issues/${issueId}$`))
        .reply(200, fixtures.issue)
      mock
        .onGet(new RegExp(`repos/${options.owner}/${options.repo}/issues/${issueId}/comments$`))
        .reply(200, fixtures.comments, { 'link': null })
    })

    test('login', async () => {
      const comments = await API.getComments({
        issueId,
        accessToken: mockToken,
        query,
      }) as VssueAPI.Comments
      expect(mock.history.get.length).toBe(2)

      const requestIssue = mock.history.get[0]
      expect(requestIssue.method).toBe('get')
      expect(requestIssue.headers['Authorization']).toBe(`token ${mockToken}`)

      const requestComments = mock.history.get[1]
      expect(requestComments.method).toBe('get')
      expect(requestComments.headers['Authorization']).toBe(`token ${mockToken}`)
      expect(requestComments.headers['Accept']).toEqual(expect.arrayContaining([
        'application/vnd.github.v3.raw+json',
        'application/vnd.github.v3.html+json',
        'application/vnd.github.squirrel-girl-preview',
      ]))
      expect(comments.count).toEqual(fixtures.comments.length)
      expect(comments.page).toEqual(query.page)
      expect(comments.perPage).toEqual(query.perPage)
      expect(comments.data.length).toBeLessThanOrEqual(query.perPage)
    })

    test('not login', async () => {
      const comments = await API.getComments({
        issueId,
        accessToken: null,
        query,
      }) as VssueAPI.Comments
      expect(mock.history.get.length).toBe(2)

      const requestIssue = mock.history.get[0]
      expect(requestIssue.method).toBe('get')
      expect(requestIssue.headers['Authorization']).toBeUndefined()

      const requestComments = mock.history.get[1]
      expect(requestComments.method).toBe('get')
      expect(requestComments.headers['Authorization']).toBeUndefined()
      expect(requestComments.headers['Accept']).toEqual(expect.arrayContaining([
        'application/vnd.github.v3.raw+json',
        'application/vnd.github.v3.html+json',
        'application/vnd.github.squirrel-girl-preview',
      ]))
      expect(comments.count).toEqual(fixtures.comments.length)
      expect(comments.page).toEqual(query.page)
      expect(comments.perPage).toEqual(query.perPage)
      expect(comments.data.length).toBeLessThanOrEqual(query.perPage)
    })
  })

  test('postComment', async () => {
    const issueId = 1
    const content = fixtures.comment.body
    mock.onPost(new RegExp(`repos/${options.owner}/${options.repo}/issues/${issueId}/comments`)).reply(201, fixtures.comment)
    const comment = await API.postComment({
      issueId,
      content,
      accessToken: mockToken,
    }) as VssueAPI.Comment
    expect(mock.history.post.length).toBe(1)
    const request = mock.history.post[0]
    expect(request.method).toBe('post')
    expect(request.headers['Authorization']).toBe(`token ${mockToken}`)
    expect(request.headers['Accept']).toEqual(expect.arrayContaining([
      'application/vnd.github.v3.raw+json',
      'application/vnd.github.v3.html+json',
      'application/vnd.github.squirrel-girl-preview',
    ]))
    expect(comment.id).toBe(fixtures.comment.id)
    expect(comment.content).toBe(fixtures.comment.body_html)
    expect(comment.contentRaw).toBe(fixtures.comment.body)
    expect(comment.createdAt).toBe(fixtures.comment.created_at)
    expect(comment.updatedAt).toBe(fixtures.comment.updated_at)
  })

  // test('putComment', async () => {
  // })

  // test('deleteComment', async () => {
  // })

  // test('getCommentReactions', async () => {
  // })

  // test('postCommentReaction', async () => {
  // })
})
