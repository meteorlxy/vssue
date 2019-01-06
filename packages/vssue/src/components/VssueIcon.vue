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

    size: {
      type: String,
      required: false,
      default: '1em',
    },

    color: {
      type: String,
      required: false,
      default: null,
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
        style: {
          'font-size': props.size,
          'fill': props.color,
        },
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
