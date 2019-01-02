import Vue from 'vue'
import Vssue from 'vssue'
// @ts-ignore
import GithubV3 from '@vssue/api'

import 'vssue/dist/vssue.min.css'
import 'github-markdown-css'

Vue.use(Vssue, {
  labels: 'Vssue',
  state: 'Vssue',
  owner: process.env.VUE_APP_OWNER,
  repo: process.env.VUE_APP_REPO,
  clientId: process.env.VUE_APP_CLIENT_ID,
  clientSecret: process.env.VUE_APP_CLIENT_SECRET,
  api: GithubV3,
})

/* eslint-disable-next-line no-new */
new Vue({
  el: '#app',
  render: h => h('Vssue', {
    props: {
      title: 'Vssue Dev',
    },
  }),
})
