<template>
  <div class="vssue-powered-by">
    <span>Powered by</span>

    <span v-if="platform && version">
      <a
        :href="platformInfo.link"
        target="_blank"
        :title="`${platformInfo.name} API ${version}`"
      >
        {{ platformInfo.name }}
      </a>

      <span>&</span>
    </span>

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
const platforms = {
  'github': {
    name: 'GitHub',
    link: 'https://github.com',
  },
  'gitlab': {
    name: 'GitLab',
    link: 'https://gitlab.com',
  },
  'bitbucket': {
    name: 'BitBucket',
    link: 'https://bitbucket.org',
  },
}

export default {
  name: 'VssuePoweredBy',

  props: {
    platform: {
      type: String,
      required: false,
      default: null,
    },

    version: {
      type: String,
      required: false,
      default: null,
    },
  },

  computed: {
    platformInfo () {
      return this.platform ? platforms[this.platform] : {}
    },
  },
}
</script>
