<template>
  <div class="vssue-status-require-login">
    <hr>

    <VssueButton
      type="primary"
      @click="$emit('login')"
    >
      {{ `Login to view comments` }}
    </VssueButton>
  </div>
</template>

<script>
import VssueButton from './VssueButton'
export default {
  name: 'VssueStatusRequireLogin',

  components: {
    VssueButton
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/variables'

.vssue-status-require-login
  text-align center
  color $themeColor
</style>
