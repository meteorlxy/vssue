<template>
  <svg
    class="vssue-icon"
    :class="iconClass"
    :style="iconStyle"
    aria-hidden="true">
    <use :xlink:href="xlinkHref"/>
  </svg>
</template>

<script>
export default {
  name: 'VssueIcon',

  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: false,
      default: '1em'
    }
  },

  computed: {
    iconClass () {
      return `icon-${this.name}`
    },

    xlinkHref () {
      return `#${this.iconClass}`
    },

    iconStyle () {
      return {
        'font-size': this.size
      }
    }
  },

  created () {
    require('../assets/iconfont/iconfont')
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/variables'

.vssue-icon
  width 1em
  height 1em
  vertical-align -0.15em
  fill $themeColor
  overflow hidden
.icon-loading
  animation rotation 1s linear infinite

@keyframes rotation
  from
    transform rotate(0deg)
  to
    transform rotate(360deg)
</style>
