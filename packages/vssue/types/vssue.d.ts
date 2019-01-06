import Vue, { PluginObject } from 'vue'
import { VssueAPI } from './api'
import { VssueOptions } from './option'

export interface VssuePlugin extends PluginObject<VssueOptions> {
  readonly version: string
  Vssue: typeof Vue
}

export interface VssueStore extends Vue {
  options: Partial<VssueOptions>
}

declare module 'vue/types/vue' {
  export interface Vue {
    $vssue?: VssueStore
  }
}

export default VssuePlugin
