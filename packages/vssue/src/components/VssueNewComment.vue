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
        :name="platform"
        :title="`Login with ${platform}`"
        size="50px"
        color="grey"
        style="padding: 5px; cursor: pointer;"
        @click.native="$emit('login')"
      />
    </div><!-- .vssue-new-comment-avatar -->

    <div class="vssue-new-comment-body">
      <VssueNewCommentInput
        ref="newCommentInput"
        :disabled="!user"
        v-model="newComment"
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
          @click="$emit('logout')"
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
          :disabled="newComment === '' || loading"
          @click.native="$emit('create-comment', { content: newComment })"
        >
          <VssueIcon
            v-show="loading"
            name="loading"
            color="grey"
          />

          {{ loading ? `Submitting` : `Submit Comment` }}
        </VssueButton>

        <VssueButton
          v-else
          class="vssue-button-login"
          type="primary"
          :title="`Click to Login with ${platform}`"
          @click.native="$emit('login')"
        >
          Login
        </VssueButton>
      </div>
    </div><!-- .vssue-new-comment-footer -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { User } from 'vssue'
import VssueButton from './VssueButton.vue'
import VssueIcon from './VssueIcon.vue'
import VssueNewCommentInput from './VssueNewCommentInput.vue'

@Component({
  components: {
    VssueButton,
    VssueIcon,
    VssueNewCommentInput,
  },
})
export default class VssueNewComment extends Vue {
  @Prop({
    type: Boolean,
    required: true,
  }) loading!: boolean

  @Prop({
    type: String,
    required: true,
  }) platform!: string

  @Prop({
    type: Object,
    required: false,
    default: null,
  }) user!: User | null

  newComment: string = ''

  add (str: string): void {
    this.newComment = this.newComment.concat(str)
  }

  focus (this: any): void {
    this.$refs.newCommentInput.focus()
  }

  reset (): void {
    this.newComment = ''
  }
}
</script>
