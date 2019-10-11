<template>
  <VssueDemo :platform="platform" />
</template>

<script>
export default {
  name: 'VssueDemoHome',

  computed: {
    isLogin () {
      if (typeof window === 'undefined') {
        return false
      }
      return Boolean(window.localStorage.getItem('Vssue.github.access_token'))
    },

    platform () {
      return this.isLogin ? 'github-v4' : 'github'
    },
  },
}
</script>
