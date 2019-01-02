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

<script>

export default {
  name: 'VssueNewCommentInput',

  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: true,
    },

    value: {
      type: String,
      required: false,
      default: '',
    },
  },

  computed: {
    content: {
      get () {
        return this.value
      },
      set (text) {
        this.$emit('input', text)
      },
    },

    contentRows () {
      return this.content.split('\n').length - 1
    },

    rows () {
      return this.contentRows < 3 ? 5 : this.contentRows + 2
    },

    placeholder () {
      return this.disabled ? 'Login to leave a comment' : 'Leave a comment. Styling with Markdown is supported'
    },
  },

  methods: {
    focus () {
      this.$refs.input.focus()
    },
  },
}
</script>
