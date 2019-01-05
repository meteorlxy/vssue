import Vue, { PluginObject, Component } from 'vue'
import { VssueAPI } from './api'
import { VssueOptions } from './option'

export interface Vssue extends PluginObject<VssueOptions> {
  readonly version: string
  VssueComponent: Component
}

export interface VssueObject extends Vue {
  readonly version: string
  options: VssueOptions
}

declare module 'vue/type/vue' {
  interface Vue {
    $vssue: VssueObject
  }
}

declare const Vssue: Vssue

export default Vssue
