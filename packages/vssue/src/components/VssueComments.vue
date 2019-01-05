<template>
  <div class="vssue-comments">
    <TransitionFade>
      <VssueStatus
        v-if="failed"
        key="failed"
        icon-name="error"
        icon-size="25px"
      >
        Failed to load comments
      </VssueStatus>

      <VssueStatus
        v-else-if="requireLogin"
        key="requie-login"
      >
        Login to view comments
      </VssueStatus>

      <VssueStatus
        v-else-if="loading"
        key="loading"
        icon-name="loading"
      >
        Loading comments...
      </VssueStatus>

      <div
        v-else
        key="comments-list"
        class="vssue-comments-list"
      >
        <TransitionFade group>
          <VssueComment
            v-for="comment in comments"
            :key="comment.id"
            :comment="comment"
            @reply="comment => $emit('reply', comment)"
            @create-reaction="reaction => $emit('create-reaction', reaction)"
          />
        </TransitionFade>
      </div>
    </TransitionFade>
  </div>
</template>

<script>
import TransitionFade from './TransitionFade.vue'
import VssueComment from './VssueComment.vue'
import VssueStatus from './VssueStatus.vue'

export default {
  name: 'VssueComments',

  components: {
    TransitionFade,
    VssueComment,
    VssueStatus,
  },

  props: {
    comments: {
      type: Array,
      required: true,
    },

    failed: {
      type: Boolean,
      required: true,
    },

    loading: {
      type: Boolean,
      required: true,
    },

    requireLogin: {
      type: Boolean,
      required: true,
    },
  },
}
</script>
