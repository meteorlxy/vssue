<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TransitionFade',

  functional: true,

  props: {
    group: {
      type: Boolean,
      required: false,
      default: false,
    },

    tag: {
      type: String,
      required: false,
      default: 'div',
    },
  },

  render(h, { props, children }) {
    return h(
      props.group ? 'TransitionGroup' : 'Transition',
      {
        props: {
          name: 'fade',
          mode: 'out-in',
          appear: true,
          tag: props.tag,
        },
      },
      children
    );
  },
});
</script>
