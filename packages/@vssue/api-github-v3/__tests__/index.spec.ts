import GithubV3 from '../src/index'
import moxios from 'moxios'

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

/**
 * This block will somehow break moxios if put into the methods scope
 */
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

describe('methods', () => {
  beforeEach(() => {
    moxios.install(API.$http)
  })

  afterEach(() => {
    moxios.uninstall(API.$http)
  })

  describe('handleAuth', () => {
    test('with matched state', async () => {
      const mockToken = 'test-token'
      const url = `https://vssue.js.org/?code=testcode&state=${options.state}`
      window.history.replaceState(null, '', url)
      const token = await API.handleAuth()
      expect(window.location.href).toBe('https://vssue.js.org/')
      expect(token).toBe(mockToken)
    })

    test('with unmatched state', async () => {
      const url = `https://vssue.js.org/?code=testcode&state=${options.state}-unmatched`
      window.history.replaceState(null, '', url)
      const token = await API.handleAuth()
      expect(window.location.href).toBe(url)
      expect(token).toBe(null)
    })
  })

  describe('getAccessToken', () => {
    test('with default proxy', async () => {
    })

    test('with custom proxy', async () => {
    })
  })

  test('getUser', async () => {
  })

  test('getIssue', async () => {
  })

  test('postIssue', async () => {
  })

  test('getComments', async () => {
  })

  test('postComment', async () => {
  })

  test('putComment', async () => {
  })

  test('deleteComment', async () => {
  })

  test('getCommentReactions', async () => {
  })

  test('postCommentReaction', async () => {
  })
})
