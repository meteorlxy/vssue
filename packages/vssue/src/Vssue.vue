<template>
  <div class="vssue">
    <Iconfont />

    <!-- header -->
    <div class="vssue-header">
      <!-- comments-count - link to issue -->
      <a
        class="vssue-header-comments-count"
        :href="vssue.issue ? vssue.issue.link : null"
        target="_blank"
      >
        <span>
          {{ vssue.comments
            ? vssue.$tc('comments', vssue.comments.count, { count: vssue.comments.count })
            : vssue.$tc('comments') }}
        </span>
      </a>

      <!-- powered-by - platform and vssue -->
      <span class="vssue-header-powered-by">
        <span>Powered by</span>

        <span v-if="vssue.API">
          <a
            :href="vssue.API.platform.link"
            target="_blank"
            :title="`${vssue.API.platform.name} API ${vssue.API.platform.version}`"
          >
            {{ vssue.API.platform.name }}
          </a>

          <span>&</span>
        </span>

        <a
          href="https://github.com/meteorlxy/vssue"
          target="_blank"
          :title="`Vssue v${vssue.version}`"
        >
          Vssue
        </a>
      </span>
    </div>

    <!-- main -->
    <TransitionFade>
      <!-- initializing -->
      <VssueStatus
        v-if="vssue.isInitializing"
        key="initializing"
        icon-name="loading"
      >
        {{ vssue.$t('initializing') }}
      </VssueStatus>

      <!-- initialized -->
      <div
        v-else
        key="initialized"
        class="vssue-body"
      >
        <!-- new-comment -->
        <VssueNewComment v-if="vssue.API" />

        <!-- notice - alert and progress -->
        <VssueNotice />

        <!-- comments - list and pagination -->
        <VssueComments />
      </div>
    </TransitionFade>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Provide } from 'vue-property-decorator'
import { Vssue as VssueNamespace, VssueAPI } from 'vssue'
import TransitionFade from './components/TransitionFade.vue'
import Iconfont from './components/Iconfont.vue'
import VssueComments from './components/VssueComments.vue'
import VssueNewComment from './components/VssueNewComment.vue'
import VssueNotice from './components/VssueNotice.vue'
import VssueStatus from './components/VssueStatus.vue'
import VssueStore from './VssueStore'

@Component({
  components: {
    Iconfont,
    TransitionFade,
    VssueComments,
    VssueNewComment,
    VssueNotice,
    VssueStatus,
  },
})
export default class Vssue extends Vue {
  @Prop({
    type: [String, Function],
    required: false,
    default: () => opts => `${opts.prefix}${document.title}`,
  }) title!: string | ((opts?: VssueNamespace.Options) => string)

  @Prop({
    type: [String, Number],
    required: false,
    default: null,
  }) issueId!: string | number | null

  @Prop({
    type: Object,
    required: false,
    default: () => ({}),
  }) options!: Partial<VssueNamespace.Options>

  /**
   * Provide the VssueStore for the child components
   */
  @Provide('vssue') vssue: VssueNamespace.Store = new VssueStore()

  /**
   * The actual title of issue
   */
  get issueTitle (): string {
    if (this.vssue.options === null) {
      return ''
    }
    return typeof this.title === 'function' ? this.title(this.vssue.options) : `${this.vssue.options.prefix}${this.title}`
  }

  /**
   * Set options of Vssue if `options` prop is changed
   */
  @Watch('options', { deep: true })
  onOptionsChange (options): void {
    this.vssue.setOptions(options)
  }

  /**
   * beforeMount hook
   */
  beforeMount (): void {
    // set options
    this.vssue.setOptions(this.options)

    // init vssue
    this.init()
  }

  /**
   * Init Vssue.
   */
  async init (): Promise<void> {
    try {
      // init VssueStore
      await this.vssue.init()

      // init comments
      if (!this.issueId) {
        await this.vssue.initCommentsByIssueTitle(this.issueTitle)
      } else {
        await this.vssue.initCommentsByIssueId(this.issueId)
      }
    } catch (e) {
      if (e.response && [401, 403].includes(e.response.status)) {
        // in some cases, require login to load comments
        this.vssue.isLoginRequired = true
      } else {
        this.vssue.isFailed = true
      }
      console.error(e)
    }
  }
}
</script>
