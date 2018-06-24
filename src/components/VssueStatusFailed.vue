<template>
  <div class="vssue-status-failed">
    <hr>

    <VssueIcon
      name="error"
      size="20px"/>
    <span>Failed to load comments</span>
  </div>
</template>

<script>
import VssueIcon from './VssueIcon'

export default {
  name: 'VssueStatusFailed',

  components: {
    VssueIcon
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/variables'

.vssue-status-failed
  text-align center
  color $textLightColor
</style>
