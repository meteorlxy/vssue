<template>
  <div class="vssue">
    <Iconfont />

    <!-- header -->
    <div class="vssue-header">
      <span class="vssue-comments-count">
        <span v-show="hasLoadedComments">
          {{ comments.length }}
        </span>

        <span>
          Comments
        </span>
      </span>

      <VssuePoweredBy
        :platform="vssueAPI.platform"
        :version="vssueAPI.version"
      />
    </div>

    <!-- main -->
    <TransitionFade>
      <!-- initializing -->
      <VssueStatus
        v-if="!hasInitialized"
        key="initializing"
        icon-name="loading"
      >
        Initializing...
      </VssueStatus>

      <!-- initialized -->
      <div
        v-else
        key="initialized"
      >
        <VssueNewComment
          ref="newComment"
          :loading="isCreatingComment"
          :platform="vssueAPI.platform"
          :user="user"
          @login="handleLogin"
          @logout="handleLogout"
          @create-comment="createComment"
        />

        <div class="vssue-body">
          <VssueComments
            :comments="comments"
            :loading="!hasLoadedComments"
            :failed="isFailed"
            :require-login="isLoginRequired"
            @reply="replyToComment"
            @create-reaction="createCommentReaction"
          />
        </div>
      </div>
    </TransitionFade>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import {
  VssueOptions,
  VssueAPI,
  VssueAPIContructor,
  User,
  Issue,
  Comment,
} from 'vssue'

import TransitionFade from './components/TransitionFade.vue'
import Iconfont from './components/Iconfont.vue'
import VssueComments from './components/VssueComments.vue'
import VssueNewComment from './components/VssueNewComment.vue'
import VssuePoweredBy from './components/VssuePoweredBy.vue'
import VssueStatus from './components/VssueStatus.vue'
import {
  getCleanURL,
  compareDateDesc,
} from '@vssue/utils'

@Component({
  components: {
    Iconfont,
    TransitionFade,
    VssueComments,
    VssueNewComment,
    VssuePoweredBy,
    VssueStatus,
  },
})
export default class Vssue extends Vue {
  @Prop({
    type: [String, Function],
    required: false,
    default: opts => `${opts.prefix}${document.title}`,
  }) title!: string | ((opts?: VssueOptions) => string)

  @Prop({
    type: Object,
    required: false,
    default: () => ({}),
  }) options!: Partial<VssueOptions>

  vssueAPI!: VssueAPI

  // the issue that fetched from the platform
  issue: Issue | null = null

  // the comments of this issue that fetched from the platform
  comments: Array<Comment> = []

  // the user that logined
  user: User | null = null

  // access token of user
  accessToken: string | null = null

  // status flags
  isFailed: boolean = false
  isLoginRequired: boolean = false
  isCreatingComment: boolean = false

  hasInitialized: boolean = false
  hasLoadedComments: boolean = false

  /**
   * the actual options used by this vssue component
   */
  get vssueOptions (): VssueOptions {
    return <VssueOptions>Object.assign({
      labels: 'Vssue',
      state: 'Vssue',
      prefix: '[Vssue]',
      admins: [],
    }, this.$vssue ? this.$vssue.options : {}, this.options)
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
    return this.vssueAPI ? `Vssue.${this.vssueAPI.platform}.access_token` : ''
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

  /**
   * created hook
   */
  async created (): Promise<void> {
    try {
      const requiredOptions = [
        'api',
        'owner',
        'repo',
        'clientId',
        'clientSecret',
      ]
      for (const opt of requiredOptions) {
        if (!this.vssueOptions[opt]) {
          throw new Error(`[Vssue] the option '${opt}' is required`)
        }
      }
      // get the VssueAPI instance according to the options.api
      const APIConstructor = this.vssueOptions.api
      this.vssueAPI = new APIConstructor({
        baseURL: this.vssueOptions.baseURL,
        labels: this.vssueOptions.labels || 'Vssue',
        state: this.vssueOptions.state || 'Vssue',
        owner: this.vssueOptions.owner,
        repo: this.vssueOptions.repo,
        clientId: this.vssueOptions.clientId,
        clientSecret: this.vssueOptions.clientSecret,
      })

      // get user
      await this.handleAuthorize()

      this.hasInitialized = true

      // get vssue
      await this.getIssue()

      // get comments of vssue
      await this.getComments()

      this.hasLoadedComments = true
    } catch (e) {
      if (e.response && [401, 403].includes(e.response.status)) {
        // in some cases, require login to load comments
        this.isLoginRequired = true
      } else {
        this.isFailed = true
      }
      throw e
    } finally {
      this.hasInitialized = true
    }
  }

  /**
   * get issue according to the labels and title
   */
  async getIssue (): Promise<void> {
    // get all issues with the labels of the owner/repo
    const vssues = await this.vssueAPI.getIssues({
      accessToken: this.accessToken,
    })

    // get the issue of this page (according to title)
    this.issue = vssues.find(vssue => vssue.title === this.issueTitle) || null

    // if the issue of this page does not exist, create it
    if (!this.issue) {
      // required login to create the issue
      if (!this.isLogined) {
        this.handleLogin()
      }

      // if current user is not admin
      if (!this.isAdmin) {
        throw Error('Failed to get Vssue')
      }

      // create the corresponding issue
      this.issue = await this.vssueAPI.createIssue({
        title: this.issueTitle,
        content: this.issueContent,
        accessToken: this.accessToken,
      })
    }
  }

  /**
   * get comments of this vssue according to the issue id
   */
  async getComments (): Promise<void> {
    try {
      if (this.issue === null) {
        throw new Error('Failed to load issue')
      }
      this.comments = await this.vssueAPI.getComments({
        issueId: this.issue.id,
        accessToken: this.accessToken,
      })
      this.comments.sort((a, b) => <number>compareDateDesc(a.createdAt, b.createdAt))
    } catch (e) {
      console.error(e)
      throw Error('Failed to get comments')
    }
  }

  /**
   * create a new comment submitted by current user
   */
  async createComment ({ content }): Promise<void> {
    try {
      if (this.issue === null) {
        throw new Error('Failed to load issue')
      }

      this.isCreatingComment = true

      // create comment
      await this.vssueAPI.createIssueComment({
        issueId: this.issue.id,
        content,
        accessToken: this.accessToken,
      })

      // refresh comments after creation
      await this.getComments()

      // reset the new comment textarea
      this.resetNewComment()
    } catch (e) {
      console.error(e)
      throw Error('Failed to create comment')
    } finally {
      this.isCreatingComment = false
    }
  }

  /**
   * create a new reaction to a certain comment
   */
  async createCommentReaction ({ commentId, reaction }): Promise<void> {
    if (this.issue === null) {
      throw new Error('Failed to load issue')
    }

    await this.vssueAPI.createCommentReaction({
      issueId: this.issue.id,
      commentId,
      reaction,
      accessToken: this.accessToken,
    })

    await this.getComments()
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

  /**
   * handle authorization if `code` and `state` exist in the query parameters
   */
  async handleAuthorize (): Promise<void> {
    // get access_token from storage
    this.accessToken = this.getAccessToken()

    // handle authorize if query has `code`
    const accessToken = await this.vssueAPI.handleAuthorize()

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
    this.vssueAPI.redirectAuthorize()
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
}
</script>
