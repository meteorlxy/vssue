<template>
  <div class="vssue">
    <Iconfont />

    <TransitionFade>
      <VssueStatus
        v-if="vssueStatus"
        :status="vssueStatus"
        @login="handleLogin"
      />

      <div v-else>
        <!-- header -->
        <div class="vssue-header">
          <span class="vssue-comments-count">
            {{ vssue.commentsCount }} Comments
          </span>

          <VssuePoweredBy />
        </div>
        <!-- ./ header -->

        <!-- new-comment -->
        <div class="vssue-new-comment">
          <!-- new-comment-avatar -->
          <div class="vssue-comment-avatar">
            <a
              v-if="isLogined"
              :href="user.homepage"
              :title="user.username"
              target="_blank"
            >
              <img :src="user.avatar">
            </a>

            <VssueIcon
              v-else
              :name="config.platform"
              :title="`Login with ${config.platform}`"
              size="50px"
              color="grey"
              style="padding: 5px; cursor: pointer;"
              @click.native="handleLogin()"
            />
          </div>
          <!-- ./ new-comment-avatar -->

          <!-- new-comment-body -->
          <div class="vssue-new-comment-body">
            <VssueNewCommentInput
              ref="newCommentInput"
              :disabled="!isLogined"
              v-model="newComment"
            />
          </div>
          <!-- ./ new-comment-body -->

          <!-- new-comment-footer -->
          <div class="vssue-new-comment-footer">
            <span
              v-if="isLogined"
              class="vssue-current-user"
            >
              <span>Current user - {{ user.username }} - </span>

              <a
                class="vssue-logout"
                @click="handleLogout()"
              >
                Logout
              </a>
            </span>

            <span
              v-else
              class="vssue-current-user"
            >
              Login with {{ config.platform }} account to leave a comment
            </span>

            <div class="vssue-new-comment-operations">
              <VssueButton
                v-if="isLogined"
                class="vssue-button-submit-comment"
                type="primary"
                :disabled="newComment === '' || isSubmitting"
                @click.native="createComment({ content: newComment })"
              >
                <VssueIcon
                  v-show="isSubmitting"
                  name="loading"
                  color="grey"
                />

                {{ isSubmitting ? `Submitting` : `Submit Comment` }}
              </VssueButton>

              <VssueButton
                v-else
                class="vssue-button-login"
                type="primary"
                :title="`Click to Login with ${config.platform}`"
                @click.native="handleLogin()"
              >
                Login
              </VssueButton>
            </div>
          </div>
          <!-- ./ new-comment-footer -->
        </div>
        <!-- ./ new-comment -->

        <!-- body -->
        <div class="vssue-body">
          <!-- comments list -->
          <div class="vssue-comments">
            <TransitionFade group>
              <VssueComment
                v-for="comment in comments"
                :key="comment.id"
                :comment="comment"
                @reply="replyToComment"
                @create-reaction="createCommentReaction"
              />
            </TransitionFade>
          </div>
        </div>
        <!-- ./ body -->
      </div>
    </TransitionFade>
  </div>
</template>

<script>
import Iconfont from './components/Iconfont.vue'
import TransitionFade from './components/TransitionFade.vue'
import VssueButton from './components/VssueButton.vue'
import VssueComment from './components/VssueComment.vue'
import VssueIcon from './components/VssueIcon.vue'
import VssueNewCommentInput from './components/VssueNewCommentInput.vue'
import VssuePoweredBy from './components/VssuePoweredBy.vue'
import VssueStatus from './components/VssueStatus.vue'
import { getCleanURL } from '@vssue/utils'

export default {
  name: 'Vssue',

  components: {
    Iconfont,
    TransitionFade,
    VssueButton,
    VssueComment,
    VssueIcon,
    VssueNewCommentInput,
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
      comments: null,

      // the content of new comment that the user input
      newComment: '',

      // the user that logined
      user: null,

      // access token of user
      accessToken: null,

      // status flags
      isFailed: false,
      isInitializing: false,
      isLoginRequired: false,
      isSubmitting: false,
    }
  },

  computed: {
    config () {
      return {
        platform: this.vssueAPI.platform,
        owner: this.vssueOptions.owner,
        labels: this.vssueOptions.labels || 'Vssue',
        state: this.vssueOptions.stata || 'Vssue',
        prefix: this.vssueOptions.prefix || '[Vssue]',
      }
    },

    /**
     * the actual options used by this vssue component
     */
    vssueOptions () {
      return Object.assign({}, this.$vssue.options, this.options)
    },

    /**
     * the actual title of this issue
     */
    vssueTitle () {
      if (typeof this.title === 'function') {
        return this.title(this.vssueOptions)
      }
      return this.config.prefix + this.title
    },

    /**
     * the actual content of this issue (used when auto creating the issue)
     */
    vssueContent () {
      return getCleanURL(window.location.href)
    },

    /**
     * current status
     */
    vssueStatus () {
      return this.isInitializing
        ? 'initializing'
        : this.isLoginRequired
          ? 'required-login'
          : this.isFailed
            ? 'failed'
            : null
    },

    /**
     * the key of access token for local storage
     */
    accessTokenKey: {
      get () {
        return `Vssue.${this.config.platform}.access_token`
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
      return this.isLogined && (this.user.username === this.config.owner || this.config.admins.contains(this.user.username))
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

      // set the isInitializing flag
      this.isInitializing = true

      // get user
      this.accessToken = this.getAccessToken()
      await this.handleAuthorize()

      // get vssue
      await this.getVssue()

      // get comments of vssue
      await this.getComments()
    } catch (e) {
      // login is required for some platform
      if (e.response) {
        if ([401, 403].includes(e.response.status)) {
          this.isLoginRequired = true
        }
      }
      console.error(e)
      // set the isFailed flag
      this.isFailed = true
    } finally {
      // unset the isInitializing flag
      this.isInitializing = false
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
        this.comments.reverse()
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
        // set the isSubmitting flag
        this.isSubmitting = true

        // create comment
        await this.vssueAPI.createIssueComment({
          issueId: this.vssue.id,
          content,
          accessToken: this.accessToken,
        })

        // refresh comments after creation
        await this.getComments()

        // reset the input comment
        this.newComment = ''
      } catch (e) {
        console.error(e)
        throw Error('Failed to create comment')
      } finally {
        // unset the isSubmitting flag
        this.isSubmitting = false
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
      this.newComment = this.newComment.concat(replyContent)
      this.$refs.newCommentInput.focus()
    },

    /**
     * handle authorization if `code` and `state` exist in the query parameters
     */
    async handleAuthorize () {
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
