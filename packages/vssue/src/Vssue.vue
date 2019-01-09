<template>
  <div class="vssue">
    <Iconfont />

    <!-- header -->
    <div class="vssue-header">
      <span class="vssue-header-comments-count">
        <span v-if="comments">
          {{ comments.count }}
        </span>

        <span>Comments</span>
      </span>

      <span class="vssue-header-powered-by">
        <span>Powered by</span>

        <span v-if="vssueAPI">
          <a
            :href="vssueAPI.platform.link"
            target="_blank"
            :title="`${vssueAPI.platform.name} API ${vssueAPI.platform.version}`"
          >
            {{ vssueAPI.platform.name }}
          </a>

          <span>&</span>
        </span>

        <a
          href="https://vssue.js.org"
          target="_blank"
          :title="`Vssue v${vssueVersion}`"
        >
          Vssue
        </a>
      </span>
    </div>

    <!-- main -->
    <TransitionFade>
      <!-- initializing -->
      <VssueStatus
        v-if="!isInitialized"
        key="initializing"
        icon-name="loading"
      >
        Initializing...
      </VssueStatus>

      <!-- initialized -->
      <div
        v-else
        key="initialized"
        class="vssue-body"
      >
        <VssueNewComment
          ref="newComment"
          :loading="isCreatingComment"
          :platform="vssueAPI.platform.name"
          :user="user"
          @login="handleLogin"
          @logout="handleLogout"
          @create-comment="createComment"
        />

        <div class="vssue-alert-container">
          <div class="vssue-nprogress">
            <TransitionFade>
              <div
                v-show="alertShow"
                class="vssue-alert"
                @click="alertShow = false"
                v-text="alertMessage"
              />
            </TransitionFade>
          </div>
        </div>

        <VssueComments
          :comments="comments"
          :reactable="vssueAPI.platform.meta.reactable"
          :sortable="vssueAPI.platform.meta.sortable"
          :loading="isLoadingComments"
          :failed="isFailed"
          :require-login="isLoginRequired"
          :page.sync="query.page"
          :per-page.sync="query.perPage"
          :sort.sync="query.sort"
          @reply="replyToComment"
          @create-reaction="createCommentReaction"
        />
      </div>
    </TransitionFade>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import {
  VssueOptions,
  VssueAPI,
} from 'vssue'
import {
  getCleanURL,
} from '@vssue/utils'
import nprogress from 'nprogress'
import TransitionFade from './components/TransitionFade.vue'
import Iconfont from './components/Iconfont.vue'
import VssueComments from './components/VssueComments.vue'
import VssueNewComment from './components/VssueNewComment.vue'
import VssueStatus from './components/VssueStatus.vue'

@Component({
  components: {
    Iconfont,
    TransitionFade,
    VssueComments,
    VssueNewComment,
    VssueStatus,
  },
})
export default class Vssue extends Vue {
  @Prop({
    type: [String, Function],
    required: false,
    default: () => opts => `${opts.prefix}${document.title}`,
  }) title!: string | ((opts?: VssueOptions) => string)

  @Prop({
    type: [String, Number],
    required: false,
    default: null,
  }) issueId!: string | number | null

  @Prop({
    type: Object,
    required: false,
    default: () => ({}),
  }) options!: Partial<VssueOptions>

  // the api instance of api package
  vssueAPI!: VssueAPI.Instance

  // the query paramters of comments
  query: VssueAPI.Query = {
    page: 1,
    perPage: 10,
    sort: 'desc',
  }

  // the issue that fetched from the platform
  issue: VssueAPI.Issue | null = null

  // the comments of this issue that fetched from the platform
  comments: VssueAPI.Comments | null = null

  // the user that logined
  user: VssueAPI.User | null = null

  // access token of user
  accessToken: string | null = null

  // alert message to show
  alertShow: boolean = false
  alertMessage: string | null = null

  // status flags
  isInitialized: boolean = false
  isLoginRequired: boolean = false
  isFailed: boolean = false
  isLoadingComments: boolean = false
  isCreatingComment: boolean = false

  /**
   * the actual options used by this vssue component
   */
  get vssueOptions (): VssueOptions {
    return <VssueOptions>Object.assign({
      labels: ['Vssue'],
      state: 'Vssue',
      prefix: '[Vssue]',
      admins: [],
      perPage: 10,
    }, this.$vssue ? this.$vssue.options : {}, this.options)
  }

  /**
   * current version of vssue
   */
  get vssueVersion (): string {
    return <string>process.env.VUE_APP_VERSION
  }

  /**
   * the actual title of this issue
   */
  get issueTitle (): string {
    if (typeof this.title === 'function') {
      return this.title(this.vssueOptions)
    }
    return `${this.vssueOptions.prefix}${this.title}`
  }

  /**
   * the actual content of this issue (used when auto creating the issue)
   */
  get issueContent (): string {
    return getCleanURL(window.location.href)
  }

  /**
   * the key of access token for local storage
   */
  get accessTokenKey (): string {
    return this.vssueAPI ? `Vssue.${this.vssueAPI.platform.name.toLowerCase()}.access_token` : ''
  }
  /**
   * flag that if the user is logined
   */
  get isLogined (): boolean {
    return this.accessToken !== null && this.user !== null
  }

  /**
   * flag that if the logined user is admin
   */
  get isAdmin (): boolean {
    return this.isLogined && this.user !== null && (this.user.username === this.vssueOptions.owner || this.vssueOptions.admins.includes(this.user.username))
  }

  @Watch('query.perPage')
  onPerPageChange () {
    this.query.page = 1
    this.getComments()
  }

  @Watch('query.page')
  @Watch('query.sort')
  onQueryChange () {
    this.getComments()
  }

  @Watch('isLoadingComments')
  onLoadingCommentsChange (val) {
    if (this.comments) {
      if (val) {
        nprogress.start()
      } else {
        nprogress.done()
      }
    }
  }

  /**
   * created hook
   */
  async created (): Promise<void> {
    try {
      // check the options
      const requiredOptions = [
        'api',
        'owner',
        'repo',
        'clientId',
        'clientSecret',
      ]
      for (const opt of requiredOptions) {
        if (!this.vssueOptions[opt]) {
          console.warn(`[Vssue] the option '${opt}' is required`)
        }
      }

      // get the VssueAPI instance according to the options.api
      const APIConstructor = this.vssueOptions.api
      this.vssueAPI = new APIConstructor({
        baseURL: this.vssueOptions.baseURL,
        labels: this.vssueOptions.labels,
        state: this.vssueOptions.state,
        owner: this.vssueOptions.owner,
        repo: this.vssueOptions.repo,
        clientId: this.vssueOptions.clientId,
        clientSecret: this.vssueOptions.clientSecret,
      })

      // set perPage option
      this.query.perPage = this.vssueOptions.perPage

      // set nprogress
      nprogress.configure({
        parent: '.vssue-nprogress',
        showSpinner: false,
        trickleSpeed: 150,
      })

      // get user
      await this.handleAuth()

      this.isInitialized = true

      if (!this.issueId) {
        // if `issueId` is not set, get the issue according to `title`
        this.issue = await this.vssueAPI.getIssue({
          accessToken: this.accessToken,
          issueTitle: this.issueTitle,
        })

        // if the issue of this page does not exist, create it
        if (!this.issue) {
          // required login to create the issue
          if (!this.isLogined) {
            this.handleLogin()
          }

          // if current user is not admin
          if (!this.isAdmin) {
            throw Error('Failed to get comments')
          }

          // create the corresponding issue
          this.issue = await this.vssueAPI.createIssue({
            title: this.issueTitle,
            content: this.issueContent,
            accessToken: this.accessToken,
          })
        }

        await this.getComments()
      } else {
        // if `issueId` is set, get the issue and comments in the mean time
        // notice that will not create the issue if not found
        const [issue, comments] = await Promise.all([
          this.vssueAPI.getIssue({
            accessToken: this.accessToken,
            issueId: this.issueId,
          }),
          this.vssueAPI.getComments({
            accessToken: this.accessToken,
            issueId: this.issueId,
          }),
        ])
        this.issue = issue
        this.comments = comments
      }
    } catch (e) {
      if (e.response && [401, 403].includes(e.response.status)) {
        // in some cases, require login to load comments
        this.isLoginRequired = true
      } else {
        this.isFailed = true
      }
      console.error(e)
    } finally {
      this.isInitialized = true
    }
  }

  /**
   * get comments of this vssue according to the issue id
   */
  async getComments (): Promise<void> {
    try {
      if (!this.isInitialized || !this.issue) return

      this.isLoadingComments = true

      const comments = await this.vssueAPI.getComments({
        accessToken: this.accessToken,
        issueId: this.issue.id,
        query: this.query,
      })
      if (this.query.page === comments.page && this.query.perPage === comments.perPage) {
        this.comments = comments
      }
    } catch (e) {
      if (e.response && [401, 403].includes(e.response.status) && !this.isLogined) {
        this.isLoginRequired = true
      }
      this.showAlert(e.message)
    } finally {
      this.isLoadingComments = false
    }
  }

  /**
   * create a new comment submitted by current user
   */
  async createComment ({ content }): Promise<void> {
    try {
      if (!this.isInitialized || !this.issue) return

      this.isCreatingComment = true

      // create comment
      await this.vssueAPI.createComment({
        accessToken: this.accessToken,
        content,
        issueId: this.issue.id,
      })

      // refresh comments after creation
      await this.getComments()

      // reset the new comment textarea
      this.resetNewComment()
    } catch (e) {
      this.showAlert(e.message)
    } finally {
      this.isCreatingComment = false
    }
  }

  /**
   * create a new reaction to a certain comment
   */
  async createCommentReaction ({
    commentId,
    reaction,
  }: {
    commentId: string | number
    reaction: keyof VssueAPI.Reactions
  }): Promise<void> {
    try {
      if (!this.isInitialized || !this.issue) return

      const success = await this.vssueAPI.createCommentReaction({
        accessToken: this.accessToken,
        commentId,
        reaction,
        issueId: this.issue.id,
      })

      if (success) {
        await this.getComments()
      } else {
        this.showAlert('Already given this reaction')
      }
    } catch (e) {
      this.showAlert(e.message)
    }
  }

  /**
   * handle authorization and set access_token
   */
  async handleAuth (): Promise<void> {
    // get access_token from storage
    this.accessToken = this.getAccessToken()

    // handle authorize if query has `code`
    const accessToken = await this.vssueAPI.handleAuth()

    if (accessToken) {
      // new access_token
      this.setAccessToken(accessToken)
      this.user = await this.vssueAPI.getUser({ accessToken })
    } else if (this.accessToken) {
      // stored access_token
      this.user = await this.vssueAPI.getUser({ accessToken: this.accessToken })
    } else {
      // no access_token
      this.setAccessToken(null)
      this.user = null
    }
  }

  /**
   * redirect to the platform's authorization page
   */
  handleLogin (): void {
    this.vssueAPI.redirectAuth()
  }

  /**
   * clean the access token stored in local storage
   */
  handleLogout (): void {
    this.setAccessToken(null)
    this.user = null
  }

  /**
   * get access token from local storage
   */
  getAccessToken (): string | null {
    return window.localStorage.getItem(this.accessTokenKey)
  }

  /**
   * save access token to local storage
   */
  setAccessToken (token): void {
    if (token === null) {
      window.localStorage.removeItem(this.accessTokenKey)
    } else {
      window.localStorage.setItem(this.accessTokenKey, token)
    }
    this.accessToken = token
  }

  /**
   * reply to a certain comment quickly
   */
  replyToComment (this: any, comment): void {
    const quotedComment = comment.contentRaw.replace(/\n/g, '\n> ')
    const replyContent = `@${comment.author.username}\n\n> ${quotedComment}\n\n`
    this.$refs.newComment.add(replyContent)
    this.$refs.newComment.focus()
  }

  /**
   * reset new comment
   */
  resetNewComment (this: any): void {
    this.$refs.newComment.reset()
  }

  showAlert (content, time = 3000): void {
    this.alertMessage = content
    this.alertShow = true
    setTimeout(() => {
      this.alertShow = false
    }, time)
  }
}
</script>
