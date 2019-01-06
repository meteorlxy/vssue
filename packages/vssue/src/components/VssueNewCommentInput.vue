<template>
  <textarea
    ref="input"
    class="vssue-new-comment-input"
    :rows="rows"
    :disabled="disabled"
    :placeholder="placeholder"
    :spellcheck="false"
    v-model="content"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class VssueNewCommentInput extends Vue {
  @Prop({
    type: Boolean,
    required: false,
    default: true,
  }) disabled!: boolean

  @Prop({
    type: String,
    required: false,
    default: '',
  }) value!: string

  get content (): string {
    return this.value
  }

  set content (text: string) {
    this.$emit('input', text)
  }

  get contentRows (): number {
    return this.content.split('\n').length - 1
  }

  get rows (): number {
    return this.contentRows < 3 ? 5 : this.contentRows + 2
  }

  get placeholder (): string {
    return this.disabled ? 'Login to leave a comment' : 'Leave a comment. Styling with Markdown is supported'
  }

  focus (this: any): void {
    this.$refs.input.focus()
  }
}
</script>
