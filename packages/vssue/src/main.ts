import { Vssue } from 'vssue'
import VssueComponent from './Vssue.vue'

const VssuePlugin: Vssue.Plugin = {
  get version () {
    return <string>process.env.VUE_APP_VERSION
  },

  installed: false,

  install (Vue, options?: Partial<Vssue.Options>) {
    if (this.installed) {
      return false
    }
    this.installed = true

    Vue.component('Vssue', {
      functional: true,

      props: {
        title: {
          type: String,
          required: false,
          default: undefined,
        },
        issueId: {
          type: [Number, String],
          required: false,
          default: undefined,
        },
        options: {
          type: Object,
          required: false,
          default: undefined,
        },
      },

      render (h, { data, props }) {
        return h(VssueComponent, {
          ...data,
          props: {
            title: props.title,
            issueId: props.issueId,
            options: Object.assign({}, options, props.options),
          },
        })
      },
    })
  },

  VssueComponent: VssueComponent,
}

export { VssueComponent }
export default VssuePlugin
