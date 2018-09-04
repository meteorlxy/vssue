<template>
  <textarea
    ref="input"
    class="vssue-new-comment-input"
    :rows="rows"
    :disabled="disabled"
    :placeholder="placeholder"
    :spellcheck="false"
    v-model="content"/>
</template>

<script>

export default {
  name: 'VssueNewCommentInput',

  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: true
    },

    value: {
      type: String,
      required: false,
      default: ''
    }
  },

  computed: {
    content: {
      get () {
        return this.value
      },
      set (text) {
        this.$emit('input', text)
      }
    },

    contentRows () {
      return this.content.split('\n').length - 1
    },

    rows () {
      return this.contentRows < 3 ? 5 : this.contentRows + 2
    },

    placeholder () {
      return this.disabled ? 'Login to leave a comment' : 'Leave a comment. Styling with Markdown is supported'
    }
  },

  methods: {
    focus () {
      this.$refs.input.focus()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/variables'

.vssue-new-comment-input
  resize none
  outline none
  width 100%
  padding 15px
  font-size 16px
  font-family $fontFamily
  background-color #fafbfc
  border 1px solid $borderColor
  border-radius 5px
  &:disabled
    cursor not-allowed
    background-color lighten($borderColor, 30%)
  &:focus
    background-color #ffffff
    box-shadow 0 0 1px 1px lighten($themeColor, 50%)
  &::placeholder
    color $textLightColor
</style>
