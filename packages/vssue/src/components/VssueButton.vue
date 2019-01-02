<template>
  <button
    class="vssue-button"
    :class="buttonClass"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'VssueButton',

  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },

    type: {
      type: String,
      required: false,
      default: 'default',
    },
  },

  computed: {
    buttonClass () {
      return `vssue-button-${this.type}`
    },
  },
}
</script>
