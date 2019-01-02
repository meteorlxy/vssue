<template>
  <div
    class="vssue-status"
    :class="statusClass"
  >
    <hr>

    <TransitionFade>
      <div v-if="status === 'required-login'">
        <VssueButton
          type="primary"
          @click.native="$emit('login')"
        >
          {{ `Login to view comments` }}
        </VssueButton>
      </div>

      <div v-else-if="status === 'initializing'">
        <VssueIcon
          name="loading"
          size="20px"
        />

        <p>Loading comments...</p>
      </div>

      <div v-else-if="status === 'failed'">
        <VssueIcon
          name="error"
          size="20px"
        />

        <span>Failed to load comments</span>
      </div>
    </TransitionFade>
  </div>
</template>

<script>
import TransitionFade from './TransitionFade.vue'
import VssueButton from './VssueButton.vue'
import VssueIcon from './VssueIcon.vue'

export default {
  name: 'VssueStatus',

  components: {
    TransitionFade,
    VssueButton,
    VssueIcon,
  },

  props: {
    status: {
      type: String,
      required: true,
    },
  },

  computed: {
    statusClass () {
      return `vssue-status-${this.status}`
    },
  },
}
</script>
