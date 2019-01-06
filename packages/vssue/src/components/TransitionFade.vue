<script lang="ts">
import Vue, { VueConstructor } from 'vue'

export default Vue.extend({
  name: 'TransitionFade',

  functional: true,

  props: {
    group: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  render (h, { props, children }) {
    return h(
      props.group ? 'TransitionGroup' : 'Transition',
      {
        props: {
          name: 'fade',
          mode: 'out-in',
          appear: true,
        },
      },
      children,
    )
  },
})
</script>
