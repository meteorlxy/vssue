<template>
  <div class="vssue-status-initializing">
    <hr>

    <VssueIcon
      name="loading"
      size="20px"/>
    <p>Loading comments...</p>
  </div>
</template>

<script>
import VssueIcon from './VssueIcon'
export default {
  name: 'VssueStatusInitializing',

  components: {
    VssueIcon
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/variables'

.vssue-status-initializing
  text-align center
  color $themeColor
</style>
