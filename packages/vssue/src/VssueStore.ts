import { Vue, Component, Watch } from 'vue-property-decorator'
import { Vssue, VssueAPI } from 'vssue'
import { getCleanURL } from '@vssue/utils'
import i18n from './i18n'

@Component({ i18n })
class VssueStore extends Vue implements Vssue.Store {
  get version () {
    return <string>process.env.VUE_APP_VERSION
  }

  options: Vssue.Options | null = null

  API: VssueAPI.Instance | null = null

  accessToken: string | null = null

  user: VssueAPI.User | null = null

  issue: VssueAPI.Issue | null = null

  comments: VssueAPI.Comments | null = null

  query: VssueAPI.Query = {
    page: 1,
    perPage: 10,
    sort: 'desc',
  }

  status: Vssue.Status = {
    isInitializing: false,
    isLoginRequired: false,
    isFailed: false,
    isLoadingComments: false,
    isCreatingComment: false,
    isUpdatingComment: false,
  }

  get computedStatus (): Vssue.ComputedStatus {
    return {
      isLogined: this.accessToken !== null && this.user !== null,
      isAdmin: this.options !== null && this.accessToken !== null && this.user !== null &&
        (
          this.user.username === this.options.owner ||
          this.options.admins.includes(this.user.username)
        ),
      isPending: this.status.isLoadingComments || this.status.isCreatingComment || this.status.isUpdatingComment,
    }
  }

  /**
   * the key of access token for local storage
   */
  get accessTokenKey (): string {
    return this.API ? `Vssue.${this.API.platform.name.toLowerCase()}.access_token` : ''
  }

  @Watch('query.perPage')
  onQueryPerPageChange () {
    this.query.page = 1
    this.getComments()
  }

  @Watch('query.page')
  @Watch('query.sort')
  onQueryChange () {
    this.getComments()
  }

  /**
   * Created hook. Bind event listeners.
   */
  created () {
    this.$on('login', this.handleLogin)
    this.$on('logout', this.handleLogout)
  }

  /**
   * Set options of Vssue
   */
  setOptions (options: Partial<Vssue.Options>): void {
    this.options = <Vssue.Options>Object.assign({
      labels: ['Vssue'],
      state: 'Vssue',
      prefix: '[Vssue]',
      admins: [],
      perPage: 10,
    }, options)

    // check options
    const requiredOptions = [
      'api',
      'owner',
      'repo',
      'clientId',
      'clientSecret',
    ]
    for (const opt of requiredOptions) {
      if (!this.options[opt]) {
        console.warn(`[Vssue] the option '${opt}' is required`)
      }
    }
  }

  /**
   * Init VssueStore
   */
  async init (): Promise<void> {
    try {
      if (!this.options) throw new Error('Options are required to initialize Vssue')

      if (this.status.isInitializing) return

      this.status.isInitializing = true

      // reset data
      this.API = null
      this.accessToken = null
      this.user = null
      this.issue = null
      this.comments = null
      this.query = {
        page: 1,
        perPage: this.options.perPage,
        sort: 'desc',
      }

      // reset status
      this.status.isLoginRequired = false
      this.status.isFailed = false
      this.status.isLoadingComments = false
      this.status.isCreatingComment = false
      this.status.isUpdatingComment = false

      // set locale
      if (this.options.locale) {
        this.$i18n.locale = this.options.locale
      } else {
        const locales = Object.keys(this.$i18n.messages)
        const navLangs = window.navigator.languages
        this.$i18n.locale = navLangs.filter(item => locales.includes(item)).shift() || 'en'
      }

      // get the VssueAPI instance according to the options.api
      const APIConstructor = this.options.api

      this.API = new APIConstructor({
        baseURL: this.options.baseURL,
        labels: this.options.labels,
        state: this.options.state,
        owner: this.options.owner,
        repo: this.options.repo,
        clientId: this.options.clientId,
        clientSecret: this.options.clientSecret,
      })

      // handle authorization
      await this.handleAuth()
    } finally {
      this.status.isInitializing = false
    }
  }

  /**
   * Init comments according to issue id
   */
  async initCommentsByIssueId (issueId: number | string): Promise<void> {
    if (!this.API) return
    // if `issueId` is set, get the issue and comments in the mean time
    // notice that will not create the issue if not found
    const [issue, comments] = await Promise.all([
      this.API.getIssue({
        accessToken: this.accessToken,
        issueId: issueId,
      }),
      this.API.getComments({
        accessToken: this.accessToken,
        issueId: issueId,
        query: this.query,
      }),
    ])
    this.issue = issue
    this.comments = comments
  }

  /**
   * Init comments according to issue title
   */
  async initCommentsByIssueTitle (issueTitle: string): Promise<void> {
    if (!this.API) return

    // get issue according to title first
    this.issue = await this.API.getIssue({
      accessToken: this.accessToken,
      issueTitle: issueTitle,
    })

    // if the issue of this page does not exist, try to create it
    if (!this.issue) {
      // require login to create the issue
      if (!this.computedStatus.isLogined) {
        this.$emit('login')
      }

      // if current user is not admin, cannot create issue
      if (!this.computedStatus.isAdmin) {
        throw Error('Failed to get comments')
      }

      // create the corresponding issue
      this.issue = await this.API.postIssue({
        title: issueTitle,
        content: getCleanURL(window.location.href),
        accessToken: this.accessToken,
      })
    }

    // try to load comments
    await this.getComments()
  }

  /**
   * Get comments of this vssue according to the issue id
   */
  async getComments (): Promise<VssueAPI.Comments | void> {
    try {
      if (!this.API || !this.issue || this.status.isLoadingComments) return

      this.status.isLoadingComments = true

      const comments = await this.API.getComments({
        accessToken: this.accessToken,
        issueId: this.issue.id,
        query: this.query,
      })

      this.comments = comments

      if (this.query.page !== comments.page) {
        this.query.page = comments.page
      }

      if (this.query.perPage !== comments.perPage) {
        this.query.perPage = comments.perPage
      }
    } catch (e) {
      if (e.response && [401, 403].includes(e.response.status) && !this.computedStatus.isLogined) {
        this.status.isLoginRequired = true
      } else {
        this.$emit('error', e)
        throw e
      }
    } finally {
      this.status.isLoadingComments = false
    }
  }

  /**
   * Post a new comment
   */
  async postComment ({
    content,
  }: {
    content: string
  }): Promise<VssueAPI.Comment | void> {
    try {
      if (!this.API || !this.issue || this.status.isCreatingComment) return

      this.status.isCreatingComment = true

      const comment = await this.API.postComment({
        accessToken: this.accessToken,
        content,
        issueId: this.issue.id,
      })

      return comment
    } catch (e) {
      this.$emit('error', e)
      throw e
    } finally {
      this.status.isCreatingComment = false
    }
  }

  /**
   * Edit a comment
   */
  async putComment ({
    commentId,
    content,
  }: {
    commentId: number | string
    content: string
  }): Promise<VssueAPI.Comment | void> {
    try {
      if (!this.API || !this.issue) return

      const comment = await this.API.putComment({
        accessToken: this.accessToken,
        issueId: this.issue.id,
        commentId,
        content,
      })

      return comment
    } catch (e) {
      this.$emit('error', e)
      throw e
    }
  }

  /**
   * Delete a new comment
   */
  async deleteComment ({
    commentId,
  }: {
    commentId: number | string
  }): Promise<boolean | void> {
    try {
      if (!this.API || !this.issue) return

      const success = await this.API.deleteComment({
        accessToken: this.accessToken,
        issueId: this.issue.id,
        commentId,
      })

      return success
    } catch (e) {
      this.$emit('error', e)
      throw e
    }
  }

  /**
   * Get reactions of a comment
   */
  async getCommentReactions ({
    commentId,
  }: {
    commentId: string | number
  }): Promise<VssueAPI.Reactions | void> {
    try {
      if (!this.API || !this.issue) return

      const reactions = await this.API.getCommentReactions({
        accessToken: this.accessToken,
        issueId: this.issue.id,
        commentId,
      })

      return reactions
    } catch (e) {
      this.$emit('error', e)
      throw e
    }
  }

  /**
   * Create a new reaction to a certain comment
   */
  async postCommentReaction ({
    commentId,
    reaction,
  }: {
    commentId: string | number
    reaction: keyof VssueAPI.Reactions
  }): Promise<boolean> {
    try {
      if (!this.API || !this.issue) return false

      const success = await this.API.postCommentReaction({
        accessToken: this.accessToken,
        issueId: this.issue.id,
        commentId,
        reaction,
      })

      return success
    } catch (e) {
      this.$emit('error', e)
      throw e
    }
  }

  /**
   * Get access token from local storage
   */
  getAccessToken (): VssueAPI.AccessToken {
    this.accessToken = window.localStorage.getItem(this.accessTokenKey)
    return this.accessToken
  }

  /**
   * Save access token to local storage
   */
  setAccessToken (token: VssueAPI.AccessToken): void {
    if (token === null) {
      window.localStorage.removeItem(this.accessTokenKey)
    } else {
      window.localStorage.setItem(this.accessTokenKey, token)
    }
    this.accessToken = token
  }

  /**
   * Handle authorization and set access_token
   */
  async handleAuth (): Promise<void> {
    if (!this.API) return

    // handle authorize and try to get the access_token
    const accessToken = await this.API.handleAuth()

    if (accessToken) {
      // new access_token
      this.setAccessToken(accessToken)
      this.user = await this.API.getUser({ accessToken })
    } else if (this.getAccessToken()) {
      // have access_token in localstorage
      this.user = await this.API.getUser({ accessToken: this.accessToken })
    } else {
      // no access_token
      this.setAccessToken(null)
      this.user = null
    }
  }

  /**
   * Redirect to the platform's authorization page
   */
  handleLogin (): void {
    if (!this.API) return
    this.API.redirectAuth()
  }

  /**
   * Clean the access token stored in local storage
   */
  handleLogout (): void {
    this.setAccessToken(null)
    this.user = null
  }
}

export default VssueStore
