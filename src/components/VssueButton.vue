<template>
  <button
    class="vssue-button"
    :class="buttonClass"
    :disabled="disabled"
  >
    <slot/>
  </button>
</template>

<script>
export default {
  name: 'VssueButton',

  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },

    type: {
      type: String,
      required: false,
      default: 'default'
    }
  },

  computed: {
    buttonClass () {
      return `vssue-button-${this.type}`
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/variables'

.vssue-button
  outline none
  cursor pointer
  padding 10px 20px
  font-size 1.05
  font-weight bold
  color $themeColor
  background-color #fff
  border 2px solid $themeColor
  border-radius 10px
  &:disabled
    cursor not-allowed
    color $borderColor
    border-color $borderColor
  &:not(:disabled)
    &.vssue-button-default
      color $textLightColor
      border-color $textLightColor
    &.vssue-button-primary
      color $themeColor
      border-color $themeColor
</style>
