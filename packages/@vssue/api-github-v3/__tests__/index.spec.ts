import { VssueAPI } from 'vssue'
import GithubV3 from '@vssue/api-github-v3'
import moxios from 'moxios'
import fixtures from './fixtures'

const baseURL = 'https://github.com'
const APIEndpoint = 'https://api.github.com'

const options = {
  owner: 'owner',
  repo: 'repo',
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  state: 'state',
  labels: ['labels'],
  proxy: url => `https://porxy/${url}`,
}

const API = new GithubV3(options)

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
  beforeEach(() => {
    moxios.install(API.$http)
  })

  afterEach(() => {
    moxios.uninstall(API.$http)
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
      moxios.stubRequest(new RegExp('login/oauth/access_token'), {
        status: 200,
        response: {
          access_token: mockToken,
        },
      })
    })

    test('with matched state', async () => {
      const url = `https://vssue.js.org/?code=${mockCode}&state=${options.state}`
      window.history.replaceState(null, '', url)
      const token = await API.handleAuth()
      expect(window.location.href).toBe('https://vssue.js.org/')
      expect(token).toBe(mockToken)
    })

    test('with unmatched state', async () => {
      const url = `https://vssue.js.org/?code=${mockCode}&state=${options.state}-unmatched`
      window.history.replaceState(null, '', url)
      const token = await API.handleAuth()
      expect(window.location.href).toBe(url)
      expect(token).toBe(null)
    })

    describe('getAccessToken', () => {
      test('with function proxy', async () => {
        const token = await API.getAccessToken({ code: mockCode })
        const request = moxios.requests.mostRecent()
        const data = JSON.parse(request.config.data)
        expect(request.url).toBe(options.proxy('https://github.com/login/oauth/access_token'))
        expect(data['client_id']).toBe(options.clientId)
        expect(data['client_secret']).toBe(options.clientSecret)
        expect(data['code']).toBe(mockCode)
        expect(token).toBe(mockToken)
      })

      test('with string proxy', async () => {
        const proxy = 'https://string.proxy?target=https://github.com/login/oauth/access_token'
        API.proxy = proxy
        const token = await API.getAccessToken({ code: mockCode })
        const request = moxios.requests.mostRecent()
        const data = JSON.parse(request.config.data)
        expect(request.url).toBe(proxy)
        expect(data['client_id']).toBe(options.clientId)
        expect(data['client_secret']).toBe(options.clientSecret)
        expect(data['code']).toBe(mockCode)
        expect(token).toBe(mockToken)
        API.proxy = options.proxy
      })
    })
  })

  test('getUser', async () => {
    moxios.stubRequest(new RegExp('/user'), {
      status: 200,
      response: fixtures.user,
    })
    const user = await API.getUser({ accessToken: mockToken })
    const request = moxios.requests.mostRecent()
    expect(request.config.headers.Authorization).toBe(`token ${mockToken}`)
    expect(user.username).toBe(fixtures.user.login)
    expect(user.avatar).toBe(fixtures.user.avatar_url)
    expect(user.homepage).toBe(fixtures.user.html_url)
  })

  describe('getIssue', () => {
    test('with issue id (login)', async () => {
      const issueId = 1
      moxios.stubRequest(new RegExp(`repos/${options.owner}/${options.repo}/issues/${issueId}`), {
        status: 200,
        response: fixtures.issue,
      })
      const issue = await API.getIssue({
        issueId,
        accessToken: mockToken,
      }) as VssueAPI.Issue
      const request = moxios.requests.mostRecent()
      expect(request.config.headers.Authorization).toBe(`token ${mockToken}`)
      expect(issue.id).toBe(fixtures.issue.number)
      expect(issue.title).toBe(fixtures.issue.title)
      expect(issue.content).toBe(fixtures.issue.body)
      expect(issue.link).toBe(fixtures.issue.html_url)
    })

    test('with issue id (not login)', async () => {
      const issueId = 1
      moxios.stubRequest(new RegExp(`repos/${options.owner}/${options.repo}/issues/${issueId}`), {
        status: 200,
        response: fixtures.issue,
      })
      const issue = await API.getIssue({
        issueId,
        accessToken: null,
      }) as VssueAPI.Issue
      const request = moxios.requests.mostRecent()
      expect(request.config.headers.Authorization).toBeUndefined()
      expect(issue.id).toBe(fixtures.issue.number)
      expect(issue.title).toBe(fixtures.issue.title)
      expect(issue.content).toBe(fixtures.issue.body)
      expect(issue.link).toBe(fixtures.issue.html_url)
    })

    // test('with issue title (login)', async () => {
    // })

    // test('with issue title (not login)', async () => {
    // })
  })

  // test('postIssue', async () => {
  // })

  // test('getComments', async () => {
  // })

  // test('postComment', async () => {
  // })

  // test('putComment', async () => {
  // })

  // test('deleteComment', async () => {
  // })

  // test('getCommentReactions', async () => {
  // })

  // test('postCommentReaction', async () => {
  // })
})
