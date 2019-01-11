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
        <span v-if="vssue.comments">
          {{ vssue.comments.count }}
        </span>

        <span>Comments</span>
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
          href="https://vssue.js.org"
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
        v-if="vssue.status.isInitializing"
        key="initializing"
        icon-name="loading"
      >
        Initializing...
      </VssueStatus>

      <!-- initialized -->
      <div
        v-else
        key="initialized"
        class="vssue-body"
      >
        <!-- new-comment -->
        <VssueNewComment />

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
  @Provide('vssue') vssue: VssueNamespace.LocalStore = new VssueStore({
    data: { options: this.getOptions() },
  })

  /**
   * The actual title of issue
   */
  get issueTitle (): string {
    return typeof this.title === 'function' ? this.title(this.vssue.options) : `${this.vssue.options.prefix}${this.title}`
  }

  /**
   * Re-init Vssue if the `title` is changed when the `issueId` is not set
   */
  @Watch('title')
  onTitleChange (): void {
    if (!this.issueId) {
      this.init()
    }
  }

  /**
   * Re-init Vssue if the `issueId` is changed
   */
  @Watch('issueId')
  onIssueIdChange (): void {
    this.init()
  }

  /**
   * Re-init Vssue if the `options` is changed
   */
  @Watch('options', { deep: true })
  onOptionsChange (): void {
    this.vssue.options = this.getOptions()
    this.init()
  }

  /**
   * Created hook. Check Options and init Vssue.
   */
  async created (): Promise<void> {
    // only check the options in development mode
    if (process.env.NODE_ENV === 'development') {
      const requiredOptions = [
        'api',
        'owner',
        'repo',
        'clientId',
        'clientSecret',
      ]
      for (const opt of requiredOptions) {
        if (!this.vssue.options[opt]) {
          console.warn(`[Vssue] the option '${opt}' is required`)
        }
      }
    }
    await this.init()
  }

  /**
   * Init Vssue.
   */
  async init (): Promise<void> {
    try {
      // init VssueStore
      await this.vssue.init()

      // show alert on error

      // init comments
      if (!this.issueId) {
        await this.vssue.initCommentsByIssueTitle(this.issueTitle)
      } else {
        await this.vssue.initCommentsByIssueId(this.issueId)
      }
    } catch (e) {
      if (e.response && [401, 403].includes(e.response.status)) {
        // in some cases, require login to load comments
        this.vssue.status.isLoginRequired = true
      } else {
        this.vssue.status.isFailed = true
      }
      console.error(e)
    }
  }

  /**
   * Merge the options from Plugin and Prop
   */
  getOptions (): VssueNamespace.Options {
    return <VssueNamespace.Options>Object.assign({
      labels: ['Vssue'],
      state: 'Vssue',
      prefix: '[Vssue]',
      admins: [],
      perPage: 10,
    }, this.$vssue ? this.$vssue.options : {}, this.options)
  }
}
</script>
