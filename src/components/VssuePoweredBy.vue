<template>
  <span class="vssue-powered-by">
    <span>Powered by </span>

    <a
      href="https://github.com/meteorlxy/vssue"
      target="_blank"
      :title="title">
      Vssue
    </a>
  </span>
</template>

<script>
export default {
  name: 'VssuePoweredBy',

  computed: {
    title () {
      /* global __VERSION__ */
      return `Vssue v${__VERSION__}`
    }
  }
}
</script>
