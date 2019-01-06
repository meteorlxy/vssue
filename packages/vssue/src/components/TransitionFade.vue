<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class TransitionFade extends Vue {
  @Prop({
    type: Boolean,
    required: false,
    default: false,
  }) group!: boolean

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
  }
}
</script>
