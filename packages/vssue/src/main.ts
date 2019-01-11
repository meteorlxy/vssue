import { Vssue } from 'vssue'

import VssueComponent from './Vssue.vue'

const VssuePlugin: Vssue.Plugin = {
  get version () {
    return <string>process.env.VUE_APP_VERSION
  },

  install (Vue, options?: Partial<Vssue.Options>) {
    if (Vue.prototype.$vssue) {
      return false
    }

    const store: Vssue.GlobalStore = new Vue({
      data: {
        options,
      },
    })

    Vue.prototype.$vssue = store
    Vue.component('Vssue', VssueComponent)
  },

  VssueComponent: VssueComponent,
}

export { VssueComponent }
export default VssuePlugin
