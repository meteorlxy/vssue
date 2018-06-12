<template>
  <svg
    class="icon"
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
    }
  },

  computed: {
    xlinkHref () {
      return `#icon-${this.name}`
    }
  },

  created () {
    require('../assets/iconfont/iconfont')
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/variables'

.icon
  width 1em
  height 1em
  vertical-align -0.15em
  fill $themeColor
  overflow hidden
</style>
