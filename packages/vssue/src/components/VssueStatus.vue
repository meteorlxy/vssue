<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import VssueIcon from './VssueIcon.vue'

export default Vue.extend({
  name: 'VssueStatus',

  functional: true,

  props: {
    iconName: {
      type: String,
      required: false,
      default: null,
    },
  },

  render (h, { props, children }) {
    const content = [h('p', {
      class: 'vssue-status-info',
    }, children)]

    if (props.iconName) {
      content.unshift(h(VssueIcon, {
        props: {
          name: props.iconName,
        },
      }))
    }

    return h('div', {
      class: 'vssue-status',
    }, content)
  },
})
</script>
