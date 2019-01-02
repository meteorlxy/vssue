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

<script>
export default {
  name: 'VssueIcon',

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

  computed: {
    iconClass () {
      return `icon-${this.name}`
    },

    xlinkHref () {
      return `#${this.iconClass}`
    },

    iconStyle () {
      return {
        'font-size': this.size,
        'fill': this.color,
      }
    },
  },
}
</script>
