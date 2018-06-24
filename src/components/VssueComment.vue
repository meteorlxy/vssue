<template>
  <div class="vssue-comment">
    <div class="vssue-comment-avatar">
      <a
        :href="author.homepage"
        :title="author.username"
        target="_blank"
      >
        <img :src="author.avatar">
      </a>
    </div>

    <div class="vssue-comment-body">
      <slot name="body">
        <div class="vssue-comment-header">
          <span class="vssue-comment-author">
            <a
              :href="author.homepage"
              :title="author.username"
              target="_blank"
            >
              {{ author.username }}
            </a>
          </span>

          <span class="vssue-comment-created-at">
            {{ createdAt }}
          </span>
        </div>

        <div class="vssue-comment-main">
          <article
            class="markdown-body"
            v-html="content"/>
        </div>

        <div class="vssue-comment-footer">
          <template v-if="showReactions">
            <span
              class="vssue-comment-reaction"
              @click="createReaction({ commentId: comment.id, reaction: 'heart' })">
              <VssueIcon name="heart"/>

              <span>{{ comment.reactions.heart }}</span>
            </span>

            <span
              class="vssue-comment-reaction"
              @click="createReaction({ commentId: comment.id, reaction: '+1' })">
              <VssueIcon name="like"/>

              <span>{{ comment.reactions['+1'] }}</span>
            </span>

            <span
              class="vssue-comment-reaction"
              @click="createReaction({ commentId: comment.id, reaction: '-1' })">
              <VssueIcon name="unlike"/>

              <span>{{ comment.reactions['-1'] }}</span>
            </span>
          </template>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import VssueIcon from './VssueIcon'
import { formatDateTime, noop } from '../utils'

export default {
  name: 'VssueComment',

  components: {
    VssueIcon
  },

  props: {
    comment: {
      type: Object,
      required: true
    },

    createReaction: {
      type: Function,
      required: false,
      default: noop
    }
  },

  computed: {
    content () {
      return this.comment.content
    },

    author () {
      return this.comment.author
    },

    createdAt () {
      return formatDateTime(this.comment.createdAt)
    },

    updatedAt () {
      return formatDateTime(this.comment.updatedAt)
    },

    showReactions () {
      return Boolean(this.comment.reactions)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/variables'

.vssue-comment
  margin 15px 0
  .vssue-comment-avatar
    float left
    width 50px
    height 50px
    img
      width 50px
      height 50px
  .vssue-comment-body
    margin-left 70px
    border 1px solid $borderColor
    border-radius 5px
    .vssue-comment-header
      padding 10px 15px
      border-bottom 1px solid $borderColor
      .vssue-comment-created-at
        float right
        color $textLightColor
    .vssue-comment-main
      padding 15px
    .vssue-comment-footer
      padding 10px 15px
      border-top 1px solid $borderColor
      text-align right
  .vssue-comment-reaction
    cursor pointer
    display inline-block
    min-width 30px
    color $themeColor
</style>
