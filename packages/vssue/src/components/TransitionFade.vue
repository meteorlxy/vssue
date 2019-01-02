<script>
export default {
  name: 'TransitionFade',

  props: {
    group: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  render (h) {
    return h(
      this.group ? 'TransitionGroup' : 'Transition',
      {
        props: {
          name: 'fade',
          mode: 'out-in',
          appear: true,
        },
      },
      this.$slots.default,
    )
  },
}
</script>
