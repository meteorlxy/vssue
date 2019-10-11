import { VueConstructor } from 'vue'
import Vssue from 'vssue'
// @ts-ignore
import VssueAPI from '@vssue/api'
import '../styles/index.styl'

declare const VSSUE_OPTIONS: string

declare module 'vue/types/vue' {
  export interface VueConstructor {
    component<Props>(id: string, definition: any): ExtendedVue<Vue, {}, {}, {}, Props>
  }
}

export default ({ Vue }: { Vue: VueConstructor}) => {
  // options come from vuepress plugin config
  const vpOptions = JSON.parse(VSSUE_OPTIONS)

  Vue.use(Vssue, Object.assign({}, vpOptions, {
    api: VssueAPI,
  }))

  // get the vssue component registered by Vssue.Plugin
  const VssueComponent = Vue.component('Vssue')

  // make the vssue component client-only
  Vue.component('Vssue', {
    functional: true,

    /* eslint-disable-next-line vue/require-render-return */
    render (h, { parent, data }) {
      // if locale is not set by user, use Vupress `$lang`
      if (!vpOptions.locale) {
        if (!data.attrs) {
          data.attrs = {}
        }
        if (!data.attrs.options) {
          data.attrs.options = {}
        }
        if (!data.attrs.options.locale) {
          data.attrs.options = Object.assign({
            locale: parent.$lang || 'en',
          }, data.attrs.options)
        }
      }
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
