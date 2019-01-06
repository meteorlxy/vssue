<template>
  <button
    class="vssue-button"
    :class="buttonClass"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class VssueButton extends Vue {
  @Prop({
    type: Boolean,
    required: false,
    default: false,
  }) disabled!: boolean

  @Prop({
    type: String,
    required: false,
    default: 'default',
  }) type!: string

  get buttonClass (): string {
    return `vssue-button-${this.type}`
  }
}
</script>
