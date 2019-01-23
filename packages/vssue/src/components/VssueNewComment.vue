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
        :title="vssue.$t('loginToComment', { platform })"
        @click="vssue.$emit('login')"
      />
    </div><!-- .vssue-new-comment-avatar -->

    <div class="vssue-new-comment-body">
      <textarea
        ref="input"
        class="vssue-new-comment-input"
        :rows="inputRows"
        :disabled="!user || loading"
        :placeholder="vssue.$t(user ? 'placeholder' : 'noLoginPlaceHolder')"
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
        <span>{{ vssue.$t('currentUser') }} - {{ user.username }} - </span>

        <a
          class="vssue-logout"
          @click="vssue.$emit('logout')"
        >
          {{ vssue.$t('logout') }}
        </a>
      </span>

      <span
        v-else
        class="vssue-current-user"
      >
        {{ vssue.$t('loginToComment', { platform }) }}
      </span>

      <div class="vssue-new-comment-operations">
        <VssueButton
          v-if="user"
          class="vssue-button-submit-comment"
          type="primary"
          :disabled="disabled"
          @click="submit()"
        >
          <VssueIcon
            v-show="loading"
            name="loading"
          />

          {{ vssue.$t(loading ? 'submitting' : 'submitComment') }}
        </VssueButton>

        <VssueButton
          v-else
          class="vssue-button-login"
          type="primary"
          :title="vssue.$t('loginToComment', { platform })"
          @click="vssue.$emit('login', { platform })"
        >
          {{ vssue.$t('login', { platform }) }}
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
  @Inject() vssue!: Vssue.Store

  content: string = ''

  get user (): VssueAPI.User | null {
    return this.vssue.user
  }

  get platform (): string | null {
    return this.vssue.API && this.vssue.API.platform.name
  }

  get disabled (): boolean {
    return this.content === '' || this.vssue.computedStatus.isPending
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

  beforeDestroy () {
    this.vssue.$off('reply-comment')
  }

  focus (this: any): void {
    this.$refs.input.focus()
  }

  async submit (): Promise<void> {
    if (this.vssue.computedStatus.isPending) return
    await this.vssue.postComment({ content: this.content })
    this.content = ''
    await this.vssue.getComments()
  }
}
</script>
