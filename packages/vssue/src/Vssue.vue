<template>
  <div class="vssue">
    <!-- iconfont -->
    <Iconfont />

    <!-- header -->
    <VssueHeader />

    <!-- body -->
    <VssueBody />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Provide } from 'vue-property-decorator'
import { Vssue as VssueNamespace, VssueAPI } from 'vssue'
import Iconfont from './components/Iconfont.vue'
import VssueBody from './components/VssueBody.vue'
import VssueHeader from './components/VssueHeader.vue'
import VssueStore from './VssueStore'

@Component({
  components: {
    Iconfont,
    VssueBody,
    VssueHeader,
  },
})
export default class Vssue extends Vue {
  @Prop({
    type: [String, Function],
    required: false,
    default: null,
  }) title!: string | ((opts?: VssueNamespace.Options) => string) | null

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
    // set issue title and issue id
    if (this.title !== null) {
      this.vssue.title = this.title
    }
    if (this.issueId !== null) {
      this.vssue.issueId = this.issueId
    }

    // set options
    this.vssue.setOptions(this.options)

    // init vssue
    this.vssue.init()
  }
}
</script>
