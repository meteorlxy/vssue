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

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Comment } from 'vssue'
import TransitionFade from './TransitionFade.vue'
import VssueComment from './VssueComment.vue'
import VssueStatus from './VssueStatus.vue'

@Component({
  components: {
    TransitionFade,
    VssueComment,
    VssueStatus,
  },
})
export default class VssueComments extends Vue {
  @Prop({
    type: Array,
    required: true,
  }) comments!: Array<Comment>

  @Prop({
    type: Boolean,
    required: true,
  }) failed!: boolean

  @Prop({
    type: Boolean,
    required: true,
  }) loading!: boolean

  @Prop({
    type: Boolean,
    required: true,
  }) requireLogin!: boolean
}
</script>
