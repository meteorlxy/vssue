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

<script>
import VssueButton from './VssueButton.vue'
import VssueIcon from './VssueIcon.vue'
import VssueNewCommentInput from './VssueNewCommentInput.vue'

export default {
  name: 'VssueNewComment',

  components: {
    VssueButton,
    VssueIcon,
    VssueNewCommentInput,
  },

  props: {
    loading: {
      type: Boolean,
      required: true,
    },

    platform: {
      type: String,
      required: true,
    },

    user: {
      type: Object,
      required: false,
      default: null,
    },
  },

  data () {
    return {
      newComment: '',
    }
  },

  methods: {
    add (str) {
      this.newComment = this.newComment.concat(str)
    },

    focus () {
      this.$refs.newCommentInput.focus()
    },

    reset () {
      this.newComment = ''
    },
  },
}
</script>
