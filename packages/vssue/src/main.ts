import {
  VssuePlugin,
  VssueOptions,
  VssueStore,
} from 'vssue'

import VssueComponent from './Vssue.vue'

const Vssue: VssuePlugin = {
  get version () {
    return <string>process.env.VUE_APP_VERSION
  },

  install (Vue, options?: Partial<VssueOptions>) {
    if (Vue.prototype.$vssue) {
      return false
    }

    const store: VssueStore = new Vue({
      data: {
        options,
      },
    })

    Vue.prototype.$vssue = store
    Vue.component('Vssue', VssueComponent)
  },

  Vssue: VssueComponent,
}

export {
  Vssue as default,
  VssueComponent as Vssue,
}
