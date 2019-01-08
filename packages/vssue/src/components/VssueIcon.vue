<script lang="ts">
import Vue, { VueConstructor } from 'vue'

export default Vue.extend({
  name: 'VssueIcon',

  functional: true,

  props: {
    name: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: false,
      default: null,
    },
  },

  render (h, { props, data }) {
    return h(
      'svg',
      {
        ...data,
        'class': [
          'vssue-icon',
          `icon-${props.name}`,
        ],
        attrs: {
          'aria-hidden': 'true',
        },
      },
      [
        h('title', props.title),
        h('use', {
          attrs: {
            'xlink:href': `#icon-${props.name}`,
          },
        }),
      ],
    )
  },
})
</script>
