import Vue, { PluginObject } from 'vue'
import { VssueAPI } from './api'
import { VssueUseOptions, VssueOptions } from './option'

export interface Vssue extends PluginObject<VssueUseOptions> {
  readonly version: string
}

export interface VssueObject extends Vue {
  readonly version: string
  options: VssueOptions
  api: VssueAPI | null
}

declare module 'vue/type/vue' {
  interface Vue {
    $vssue: VssueObject
  }
}

declare const Vssue: Vssue

export default Vssue
