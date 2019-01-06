<template>
  <svg
    class="vssue-icon"
    :class="iconClass"
    :style="iconStyle"
    aria-hidden="true"
  >
    <title v-text="title" />

    <use :xlink:href="xlinkHref" />
  </svg>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class VssueIcon extends Vue {
  @Prop({
    type: String,
    required: true,
  }) name!: string

  @Prop({
    type: String,
    required: false,
    default: '1em',
  }) size!: string

  @Prop({
    type: String,
    required: false,
    default: null,
  }) color!: string | null

  @Prop({
    type: String,
    required: false,
    default: null,
  }) title!: string | null

  get iconClass (): string {
    return `icon-${this.name}`
  }

  get xlinkHref (): string {
    return `#${this.iconClass}`
  }

  get iconStyle (): any {
    return {
      'font-size': this.size,
      'fill': this.color,
    }
  }
}
</script>
