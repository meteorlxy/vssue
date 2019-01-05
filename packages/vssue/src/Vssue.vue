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

<script>
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

export default {
  name: 'Vssue',

  components: {
    Iconfont,
    TransitionFade,
    VssueComments,
    VssueNewComment,
    VssuePoweredBy,
    VssueStatus,
  },

  props: {
    /**
     * Vssue options that will override the default options set by Vue.use()
     */
    options: {
      type: Object,
      required: false,
      default: () => ({}),
    },

    /**
     * title of this Vssue. default is `document.title`
     */
    title: {
      type: [String, Function],
      required: false,
      default: () => document.title,
    },
  },

  data () {
    return {
      // the VssueAPI Instance. i.e. GithubV3 / GitlabV4 / BitbucketV2
      vssueAPI: null,

      // the issue that fetched from the platform
      vssue: null,

      // the comments of this issue that fetched from the platform
      comments: [],

      // the user that logined
      user: null,

      // access token of user
      accessToken: null,

      // status flags
      isFailed: false,
      isLoginRequired: false,
      isCreatingComment: false,

      hasInitialized: false,
      hasLoadedComments: false,
    }
  },

  computed: {
    /**
     * the actual options used by this vssue component
     */
    vssueOptions () {
      return Object.assign({
        labels: 'Vssue',
        state: 'Vssue',
        prefix: '[Vssue]',
        admins: [],
      }, this.$vssue.options, this.options)
    },

    /**
     * the actual title of this issue
     */
    vssueTitle () {
      if (typeof this.title === 'function') {
        return this.title(this.vssueOptions)
      }
      return this.vssueOptions.prefix + this.title
    },

    /**
     * the actual content of this issue (used when auto creating the issue)
     */
    vssueContent () {
      return getCleanURL(window.location.href)
    },

    /**
     * the key of access token for local storage
     */
    accessTokenKey: {
      get () {
        return `Vssue.${this.vssueAPI.platform}.access_token`
      },
    },

    /**
     * flag that if the user is logined
     */
    isLogined () {
      return this.accessToken !== null && this.user !== null
    },

    /**
     * flag that if the logined user is admin
     */
    isAdmin () {
      return this.isLogined && (this.user.username === this.vssueOptions.owner || this.vssueOptions.admins.contains(this.user.username))
    },
  },

  async created () {
    try {
      // get the VssueAPI instance according to the options.api
      if (this.vssueAPI === null) {
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
      }

      // get user
      await this.handleAuthorize()

      this.hasInitialized = true

      // get vssue
      await this.getVssue()

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
    } finally {
      this.hasInitialized = true
    }
  },

  methods: {
    /**
     * get vssue according to the labels and title
     */
    async getVssue () {
      // get all vssues (issues with vssue's labels) of the owner/repo
      const vssues = await this.vssueAPI.getIssues({
        accessToken: this.accessToken,
      })

      // get the vssue of this page (according to title)
      this.vssue = vssues.find(vssue => vssue.title === this.vssueTitle) || null

      // if the vssue of this page does not exist, create it
      if (!this.vssue) {
        // required login to create the vssue
        if (!this.isLogined) {
          this.handleLogin()
        }

        // if current user is not admin
        if (!this.isAdmin) {
          throw Error('Failed to get Vssue')
        }

        // create the corresponding issue
        this.vssue = await this.vssueAPI.createIssue({
          title: this.vssueTitle,
          content: this.vssueContent,
          accessToken: this.accessToken,
        })
      }
    },

    /**
     * get comments of this vssue according to the issue id
     */
    async getComments () {
      try {
        this.comments = await this.vssueAPI.getComments({
          issueId: this.vssue.id,
          accessToken: this.accessToken,
        })
        this.comments.sort((a, b) => compareDateDesc(a.createdAt, b.createdAt))
      } catch (e) {
        console.error(e)
        throw Error('Failed to get comments')
      }
    },

    /**
     * create a new comment submitted by current user
     */
    async createComment ({ content }) {
      try {
        this.isCreatingComment = true

        // create comment
        await this.vssueAPI.createIssueComment({
          issueId: this.vssue.id,
          content,
          accessToken: this.accessToken,
        })

        // refresh comments after creation
        await this.getComments()

        // reset the input comment
        this.$refs.newComment.reset()
      } catch (e) {
        console.error(e)
        throw Error('Failed to create comment')
      } finally {
        this.isCreatingComment = false
      }
    },

    /**
     * create a new reaction to a certain comment
     */
    async createCommentReaction ({ commentId, reaction }) {
      await this.vssueAPI.createCommentReaction({
        issueId: this.vssue.id,
        commentId,
        reaction,
        accessToken: this.accessToken,
      })
      await this.getComments()
    },

    /**
     * reply to a certain comment quickly
     */
    replyToComment (comment) {
      const quotedComment = comment.contentRaw.replace(/\n/g, '\n> ')
      const replyContent = `@${comment.author.username}\n\n> ${quotedComment}\n\n`
      this.$refs.newComment.add(replyContent)
      this.$refs.newComment.focus()
    },

    /**
     * handle authorization if `code` and `state` exist in the query parameters
     */
    async handleAuthorize () {
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
    },

    /**
     * redirect to the platform's authorization page
     */
    handleLogin () {
      this.vssueAPI.redirectAuthorize()
    },

    /**
     * clean the access token stored in local storage
     */
    handleLogout () {
      this.setAccessToken(null)
      this.user = null
    },

    /**
     * get access token from local storage
     */
    getAccessToken () {
      return window.localStorage.getItem(this.accessTokenKey)
    },

    /**
     * save access token to local storage
     */
    setAccessToken (token) {
      if (token === null) {
        window.localStorage.removeItem(this.accessTokenKey)
      } else {
        window.localStorage.setItem(this.accessTokenKey, token)
      }
      this.accessToken = token
    },
  },
}
</script>
