<template>
  <div class="vssue-status">
    <VssueIcon
      v-if="iconName"
      :name="iconName"
      :size="iconSize"
    />

    <p>
      <slot />
    </p>
  </div>
</template>

<script>
import VssueIcon from './VssueIcon.vue'

export default {
  name: 'VssueStatus',

  components: {
    VssueIcon,
  },

  props: {
    iconName: {
      type: String,
      required: false,
      default: null,
    },

    iconSize: {
      type: String,
      required: false,
      default: '20px',
    },
  },
}
</script>
