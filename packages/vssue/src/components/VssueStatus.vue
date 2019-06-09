<template>
  <TransitionFade>
    <div
      v-if="status"
      :key="status"
      class="vssue-status"
    >
      <VssueIcon
        v-if="['failed', 'loadingComments', 'initializing'].includes(status)"
        :name="status === 'failed' ? 'error' : 'loading'"
      />

      <p class="vssue-status-info">
        <Component
          :is="['issueNotCreated', 'loginRequired'].includes(status) ? 'a' : 'span'"
          @click="handleClick"
        >
          {{ vssue.$t(status) }}
        </Component>
      </p>
    </div>
  </TransitionFade>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator'
import { Vssue } from 'vssue'
import TransitionFade from './TransitionFade.vue'
import VssueIcon from './VssueIcon.vue'

@Component({
  components: {
    TransitionFade,
    VssueIcon,
  },
})
export default class VssueStatus extends Vue {
  @Inject() vssue!: Vssue.Store

  get status (): string | null {
    if (this.vssue.isFailed) {
      return 'failed'
    } else if (this.vssue.isInitializing) {
      return 'initializing'
    } else if (this.vssue.isIssueNotCreated && !this.vssue.isCreatingIssue) {
      if (this.vssue.isAdmin || !this.vssue.isLogined) {
        return 'issueNotCreated'
      } else {
        return 'failed'
      }
    } else if (this.vssue.isLoginRequired) {
      return 'loginRequired'
    } else if (!this.vssue.comments || this.vssue.isCreatingIssue) {
      return 'loadingComments'
    } else if (this.vssue.comments.data.length === 0) {
      return 'noComments'
    } else {
      return null
    }
  }

  handleClick (): void {
    if (this.status === 'issueNotCreated') {
      this.vssue.postIssue()
    } else if (this.status === 'loginRequired') {
      this.vssue.login()
    }
  }
}
</script>
