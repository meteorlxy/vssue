import Vssue, { Vssue as VssueComponent } from 'vssue'
// @ts-ignore
import VssueAPI from '@vssue/api'

import '../styles/variables.styl'

import { VueConstructor } from 'vue'

declare const VSSUE_OPTIONS: string

declare module 'vue/types/vue' {
  export interface VueConstructor {
    component<Props>(id: string, definition: any): ExtendedVue<Vue, {}, {}, {}, Props>
  }
}

export default ({ Vue }: { Vue: VueConstructor}) => {
  // options come from vuepress plugin config
  Vue.use(Vssue, Object.assign(JSON.parse(VSSUE_OPTIONS), {
    api: VssueAPI,
  }))

  // make vssue client-only
  Vue.component('Vssue', {
    functional: true,

    /* eslint-disable-next-line vue/require-render-return */
    render (h, { parent, data }) {
      if (parent._isMounted) {
        return h(VssueComponent, data)
      } else {
        parent.$once('hook:mounted', () => {
          parent.$forceUpdate()
        })
      }
    },
  })
}
