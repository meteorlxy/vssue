import Vssue from 'vssue'
import 'vssue/dist/vssue.min.css'
// @ts-ignore
import VssueAPI from '@vssue/api'

declare const VSSUE_OWNER
declare const VSSUE_REPO
declare const VSSUE_CLIENT_ID
declare const VSSUE_CLIENT_SECRET

export default ({ Vue }) => {
  Vue.use(Vssue, {
    owner: VSSUE_OWNER,
    repo: VSSUE_REPO,
    clientId: VSSUE_CLIENT_ID,
    clientSecret: VSSUE_CLIENT_SECRET,
    api: VssueAPI,
  })
}
