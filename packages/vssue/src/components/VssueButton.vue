<script lang="ts">
import Vue, { VueConstructor } from 'vue'

export default Vue.extend({
  name: 'VssueIcon',

  functional: true,

  props: {
    type: {
      type: String,
      required: false,
      default: 'default',
    },
  },

  render (h, { props, data, children }) {
    return h(
      'button',
      {
        ...data,
        'class': [
          'vssue-button',
          `vssue-button-${props.type}`,
        ],
      },
      children,
    )
  },
})
</script>
