<template>
  <div class="vssue-powered-by">
    <span>Powered by </span>

    <a
      href="https://vssue.js.org"
      target="_blank"
      :title="`Vssue v${$vssue.version}`"
    >
      Vssue
    </a>
  </div>
</template>

<script>
export default {
  name: 'VssuePoweredBy',
}
</script>
