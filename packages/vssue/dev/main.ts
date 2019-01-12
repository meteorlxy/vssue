import Vue from 'vue'
import VssuePlguin, {
  Vssue,
  VssueComponent,
} from 'vssue'
// @ts-ignore
import GithubV3 from '@vssue/api'

import 'vssue/dist/vssue.css'
import 'github-markdown-css'

const onlyComponent: boolean = process.env.VUE_APP_ONLY_COMPONENT === 'true'

const options: Vssue.Options = {
  api: GithubV3,
  owner: process.env.VUE_APP_OWNER,
  repo: process.env.VUE_APP_REPO,
  clientId: process.env.VUE_APP_CLIENT_ID,
  clientSecret: process.env.VUE_APP_CLIENT_SECRET,
  state: 'Vssue',
  labels: ['Vssue'],
  prefix: '[Vssue]',
  admins: [],
  perPage: 5,
}

if (!onlyComponent) {
  Vue.use(VssuePlguin, options)
} else {
  Vue.component('Vssue', VssueComponent)
}

/* eslint-disable-next-line no-new */
new Vue({
  el: '#app',

  data () {
    return {
      title: 'Vssue Dev',
      issueId: 1,
      options: onlyComponent ? options : {
        // override the default options here if use plugin
        perPage: 7,
        // locale: 'en',
      },
    }
  },

  template: '<Vssue :issue-id="issueId" :options="options" />',
})
