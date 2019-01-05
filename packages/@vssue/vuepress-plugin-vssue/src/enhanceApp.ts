import Vssue from 'vssue'
import 'vssue/dist/vssue.min.css'
// @ts-ignore
import VssueAPI from '@vssue/api'

declare const VSSUE_OPTIONS: string

export default ({ Vue }) => {
  Vue.use(Vssue, Object.assign(JSON.parse(VSSUE_OPTIONS), {
    api: VssueAPI,
  }))
}
