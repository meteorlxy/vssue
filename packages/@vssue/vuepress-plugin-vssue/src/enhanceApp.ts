import Vssue, { Vssue as VssueComponent } from 'vssue'
import 'vssue/dist/vssue.min.css'
// @ts-ignore
import VssueAPI from '@vssue/api'

import { VueConstructor } from 'vue'

declare const VSSUE_OPTIONS: string

declare module 'vue/types/vue' {
  export interface VueConstructor {
    component<Props>(id: string, definition: any): ExtendedVue<Vue, {}, {}, {}, Props>
  }
}

export default ({ Vue }: { Vue: VueConstructor}) => {
  Vue.use(Vssue, Object.assign(JSON.parse(VSSUE_OPTIONS), {
    api: VssueAPI,
  }))

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
