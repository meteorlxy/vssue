<template>
  <div
    class="vssue"
    :class="themeClass">
    <template v-if="isLoginRequired">
      <VssueButton
        class="vssue-button-login"
        :type="isLogined ? 'default' : 'primary'"
        @click.native="isLogined ? handleLogout() : handleLogin()"
      >
        {{ isLogined ? 'Logout' : `Login with ${config.platform}` }}
      </VssueButton>
    </template>

    <template v-else-if="isFailed">
      <p>failed...</p>
    </template>

    <template v-else-if="!isInitialized">
      <p>initializing...</p>
    </template>

    <template v-else>
      <div class="vssue-header">
        <span>{{ vssue.commentsCount }} comments</span>
      </div>

      <div class="vssue-body">
        <div class="vssue-comments">
          <VssueComment
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
            :create-reaction="createCommentReaction"
          />
        </div>
      </div>

      <div class="vssue-footer">
        <div class="vssue-new-comment">
          <div class="vssue-new-comment-body">
            <VssueNewCommentInput
              :disabled="!isLogined"
              v-model="newComment"/>

            <div class="vssue-new-comment-footer">
              <VssuePoweredBy/>

              <div class="vssue-new-comment-operations">
                <VssueButton
                  class="vssue-button-login"
                  :type="isLogined ? 'default' : 'primary'"
                  @click.native="isLogined ? handleLogout() : handleLogin()"
                >
                  {{ isLogined ? 'Logout' : `Login with ${config.platform}` }}
                </VssueButton>

                <VssueButton
                  v-if="isLogined"
                  class="vssue-button-submit-comment"
                  type="primary"
                  :disabled="newComment === ''"
                  @click.native="createComment({ content: newComment })"
                >
                  Submit comment
                </VssueButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import VssueButton from './components/VssueButton'
import VssueComment from './components/VssueComment'
import VssueNewCommentInput from './components/VssueNewCommentInput'
import VssuePoweredBy from './components/VssuePoweredBy'
import authorizationMixin from './mixins/authorizationMixin'
import { Github, Gitlab, Bitbucket } from './api'
import { getCleanURL } from './utils'

export default {
  name: 'Vssue',

  components: {
    VssueButton,
    VssueComment,
    VssueNewCommentInput,
    VssuePoweredBy
  },

  mixins: [
    authorizationMixin
  ],

  props: {
    options: {
      type: Object,
      required: true,
      validator: options => {
        const requiredOptions = [
          'owner',
          'repo',
          'clientId',
          'clientSecret'
        ]
        for (const opt of requiredOptions) {
          if (!options.hasOwnProperty(opt)) {
            console.warn(`[Vssue warn] option '${opt}' is required`)
            return false
          }
        }
        return true
      }
    }
  },

  data () {
    return {
      vssue: null,
      comments: null,

      newComment: '',

      isInitialized: false,
      isLoading: false,
      isFailed: false,
      isLoginRequired: false
    }
  },

  computed: {
    config () {
      return {
        platform: (this.options.platform || 'github').toLowerCase(),
        baseURL: this.options.baseURL,
        clientId: this.options.clientId,
        clientSecret: this.options.clientSecret,
        owner: this.options.owner,
        repo: this.options.repo,
        labels: this.options.labels || 'Vssue',
        prefix: this.options.prefix || '[Vssue]',
        theme: this.options.theme || 'default',
        state: this.options.stata || 'Vssue'
      }
    },

    api () {
      if (this.config.platform === 'github') {
        return new Github(this.config)
      }
      if (this.config.platform === 'gitlab') {
        return new Gitlab(this.config)
      }
      if (this.config.platform === 'bitbucket') {
        return new Bitbucket(this.config)
      }
    },

    themeClass () {
      return `vssue-theme-${this.config.theme}`
    },

    vssueTitle () {
      return this.config.prefix + document.title
    },

    vssueContent () {
      return getCleanURL(window.location.href)
    }
  },

  async created () {
    try {
      // Get user
      this.accessToken = this.getAccessToken()
      await this.handleAuthorize()
      // Get vssue
      await this.getVssue()
      // Get comments of vssue
      await this.getComments()
      // Initialized
      this.isInitialized = true
    } catch (e) {
      console.error(e)
      if (e.response) {
        if (e.response.status === 401) {
          this.isLoginRequired = true
        }
      }
      this.isFailed = true
    }
  },

  methods: {
    async getVssue () {
      // Get all vssues (issues with vssue's labels) of the owner/repo
      const vssues = await this.api.getIssues({
        accessToken: this.accessToken
      })
      // Get the vssue of this page (according to title and content)
      this.vssue = vssues.find(vssue => vssue.title === this.vssueTitle) || null
      // If the vssue of this page does not exist, create it
      if (!this.vssue) {
        if (!this.isLogined) {
          this.handleLogin()
        }
        if (!this.isAdmin) {
          throw Error('Failed to get Vssue')
        }
        this.vssue = await this.api.createIssue({
          title: this.vssueTitle,
          content: this.vssueContent,
          accessToken: this.accessToken
        })
      }
    },

    async getComments () {
      this.comments = await this.api.getComments({
        issueId: this.vssue.id,
        accessToken: this.accessToken
      })
    },

    async createComment ({ content }) {
      await this.api.createIssueComment({
        issueId: this.vssue.id,
        content,
        accessToken: this.accessToken
      })
      await this.getComments()
    },

    async createCommentReaction ({ commentId, reaction }) {
      await this.api.createCommentReaction({
        issueId: this.vssue.id,
        commentId,
        reaction,
        accessToken: this.accessToken
      })
      await this.getComments()
    }
  }
}
</script>

<style src="./styles/normalize.styl"></style>

<style src="github-markdown-css"></style>

<style lang="stylus" scoped>
@import './styles/variables'
@import './styles/helpers'

.vssue-header
  padding-bottom 10px
  border-bottom 1px solid $borderColor

.vssue-body
  margin 15px 0

.vssue-footer
  padding-top 10px
  border-top 1px solid $borderColor

.vssue-new-comment
  .vssue-new-comment-body
    margin-left 70px
    .vssue-new-comment-footer
      padding 10px 0
      @extend .clearfix
      .vssue-new-comment-operations
        float right
</style>
