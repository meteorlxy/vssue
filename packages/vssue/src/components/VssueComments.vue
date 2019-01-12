<template>
  <div class="vssue-comments">
    <TransitionFade>
      <!-- failed -->
      <VssueStatus
        v-if="vssue.status.isFailed"
        key="failed"
        icon-name="error"
      >
        {{ vssue.$t('failed') }}
      </VssueStatus>

      <!-- require login -->
      <VssueStatus
        v-else-if="vssue.status.isLoginRequired"
        key="require-login"
      >
        <a @click="vssue.$emit('login')">
          {{ vssue.$t('requireLogin') }}
        </a>
      </VssueStatus>

      <!-- loading -->
      <VssueStatus
        v-else-if="!vssue.comments"
        key="loading-comments"
        icon-name="loading"
      >
        {{ vssue.$t('loadingComments') }}
      </VssueStatus>

      <!-- no comments yet -->
      <VssueStatus
        v-else-if="vssue.comments.data.length === 0"
        key="no-comments"
      >
        {{ vssue.$t('noComments') }}
      </VssueStatus>

      <!-- comments-list -->
      <div
        v-else
        key="comments-list"
        class="vssue-comments-list"
      >
        <!-- pagination top -->
        <VssuePagination />

        <!-- list of comments -->
        <TransitionFade group>
          <VssueComment
            v-for="comment in vssue.comments.data"
            :key="comment.id"
            :comment="comment"
          />
        </TransitionFade>

        <!-- pagination bottom - if too many comments -->
        <VssuePagination v-show="vssue.comments.data.length > 5" />
      </div>
    </TransitionFade>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject } from 'vue-property-decorator'
import { Vssue } from 'vssue'
import TransitionFade from './TransitionFade.vue'
import VssueComment from './VssueComment.vue'
import VssuePagination from './VssuePagination.vue'
import VssueStatus from './VssueStatus.vue'

@Component({
  components: {
    TransitionFade,
    VssueComment,
    VssuePagination,
    VssueStatus,
  },
})
export default class VssueComments extends Vue {
  @Inject() vssue!: Vssue.Store
}
</script>
