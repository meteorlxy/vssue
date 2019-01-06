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
      :title="`Vssue v${vssueVersion}`"
    >
      Vssue
    </a>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

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

@Component
export default class VssuePoweredBy extends Vue {
  @Prop({
    type: String,
    required: false,
    default: null,
  }) platform!: string | null

  @Prop({
    type: String,
    required: false,
    default: null,
  }) version!: string | null

  get platformInfo (): any {
    return this.platform ? platforms[this.platform] : {}
  }

  get vssueVersion (): string {
    return <string>process.env.VUE_APP_VERSION
  }
}
</script>
