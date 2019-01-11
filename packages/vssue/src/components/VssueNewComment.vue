<template>
  <div class="vssue-new-comment">
    <div class="vssue-comment-avatar">
      <a
        v-if="user"
        :href="user.homepage"
        :title="user.username"
        target="_blank"
      >
        <img :src="user.avatar">
      </a>

      <VssueIcon
        v-else
        :name="platform.toLowerCase()"
        :title="`Login with ${platform}`"
        @click="vssue.$emit('login')"
      />
    </div><!-- .vssue-new-comment-avatar -->

    <div class="vssue-new-comment-body">
      <textarea
        ref="input"
        class="vssue-new-comment-input"
        :rows="inputRows"
        :disabled="!user || loading"
        :placeholder="user ? 'Leave a comment. Styling with Markdown is supported. Ctrl + Enter to submit.' : 'Login to leave a comment'"
        :spellcheck="false"
        v-model="content"
        @keyup.enter.ctrl="submit()"
      />
    </div><!-- .vssue-new-comment-body -->

    <div class="vssue-new-comment-footer">
      <span
        v-if="user"
        class="vssue-current-user"
      >
        <span>Current user - {{ user.username }} - </span>

        <a
          class="vssue-logout"
          @click="vssue.$emit('logout')"
        >
          Logout
        </a>
      </span>

      <span
        v-else
        class="vssue-current-user"
      >
        Login with {{ platform }} account to leave a comment
      </span>

      <div class="vssue-new-comment-operations">
        <VssueButton
          v-if="user"
          class="vssue-button-submit-comment"
          type="primary"
          :disabled="content === '' || loading"
          @click="submit()"
        >
          <VssueIcon
            v-show="loading"
            name="loading"
          />

          {{ loading ? `Submitting` : `Submit Comment` }}
        </VssueButton>

        <VssueButton
          v-else
          class="vssue-button-login"
          type="primary"
          :title="`Click to Login with ${platform}`"
          @click="vssue.$emit('login')"
        >
          Login
        </VssueButton>
      </div>
    </div><!-- .vssue-new-comment-footer -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject } from 'vue-property-decorator'
import { VssueAPI, Vssue } from 'vssue'
import VssueButton from './VssueButton.vue'
import VssueIcon from './VssueIcon.vue'

@Component({
  components: {
    VssueButton,
    VssueIcon,
  },
})
export default class VssueNewComment extends Vue {
  @Inject() vssue!: Vssue.LocalStore

  content: string = ''

  get user (): VssueAPI.User | null {
    return this.vssue.user
  }

  get platform (): string | null {
    return this.vssue.API && this.vssue.API.platform.name
  }

  get loading (): boolean {
    return this.vssue.status.isCreatingComment
  }

  get contentRows (): number {
    return this.content.split('\n').length - 1
  }

  get inputRows (): number {
    return this.contentRows < 3 ? 5 : this.contentRows + 2
  }

  created () {
    this.vssue.$on('reply-comment', (comment) => {
      const quotedComment = comment.contentRaw.replace(/\n/g, '\n> ')
      const replyContent = `@${comment.author.username}\n\n> ${quotedComment}\n\n`
      this.content = this.content.concat(replyContent)
      this.focus()
    })
  }

  focus (this: any): void {
    this.$refs.input.focus()
  }

  async submit (): Promise<void> {
    await this.vssue.postComment({ content: this.content })
    this.content = ''
  }

  beforeDestroy () {
    this.vssue.$off('reply-comment')
  }
}
</script>
