<template>
  <Vssue :options="vssueOptions"/>
</template>

<script>
import Vssue from '../../../src/Vssue'

export default {
  name: 'VssueDemo',

  components: {
    Vssue
  },

  computed: {
    vssueOptions () {
      return {
        platform: 'github',
        owner: 'meteorlxy',
        repo: 'vssue',
        clientId: 'a1097b7751127c6d1194',
        clientSecret: '5c95e2f890b6a2b80dbda17656e9b1db9e87a07b'
      }
    }
  }
}
</script>
