import {
  Vssue as VssuePlugin,
  VssueUseOptions,
} from 'vssue'

import VssueComponent from './Vssue.vue'

const version = <string>process.env.VUE_APP_VERSION

const Vssue: VssuePlugin = {
  get version () {
    return version
  },

  install (Vue, options?: VssueUseOptions) {
    if (typeof options === 'undefined' || !options.api
    ) {
      throw new Error('[Vssue] options of vssue is not valid')
    }

    if (Vue.prototype.$vssue) {
      return false
    }

    const vssue = new Vue({
      data: {
        version,
        options,
      },
    })

    Vue.prototype.$vssue = vssue
    Vue.component('Vssue', VssueComponent)
  },

  VssueComponent,
}

export default Vssue
