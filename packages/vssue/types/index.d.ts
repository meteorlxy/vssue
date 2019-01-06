import Vue from 'vue'
import VssuePlugin from './vssue'

export {
  VssuePlugin,
  VssueStore,
} from './vssue'

export {
  VssueOptions,
  VssueAPIOptions,
} from './option'

export {
  User,
  Issue,
  Comment,
  Reactions,
  VssueAPI,
  VssueAPIContructor,
} from './api'

declare const Vssue: typeof Vue
declare const VssuePluginInstance: VssuePlugin

export { Vssue }
export default VssuePluginInstance
