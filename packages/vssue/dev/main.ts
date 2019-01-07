import Vue from 'vue'
import VssuePlguin, {
  Vssue,
  VssueOptions,
} from 'vssue'
// @ts-ignore
import GithubV3 from '@vssue/api'

import 'vssue/dist/vssue.css'
import 'github-markdown-css'

const onlyComponent: boolean = process.env.VUE_APP_ONLY_COMPONENT === 'true'

const options: VssueOptions = {
  state: 'Vssue',
  labels: 'Vssue',
  prefix: '[Vssue]',
  admins: [],
  owner: process.env.VUE_APP_OWNER,
  repo: process.env.VUE_APP_REPO,
  clientId: process.env.VUE_APP_CLIENT_ID,
  clientSecret: process.env.VUE_APP_CLIENT_SECRET,
  api: GithubV3,
}

if (!onlyComponent) {
  Vue.use(VssuePlguin, options)
} else {
  Vue.component('Vssue', Vssue)
}

/* eslint-disable-next-line no-new */
new Vue({
  el: '#app',
  render: h => h('Vssue', {
    props: {
      title: 'Vssue Dev',
      options,
    },
  }),
})
