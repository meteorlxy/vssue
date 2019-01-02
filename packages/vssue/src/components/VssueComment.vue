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
            v-html="content"
          />
        </div>

        <div class="vssue-comment-footer">
          <span
            v-if="showReactions"
            class="vssue-comment-reactions"
          >
            <span
              class="vssue-comment-reaction"
              @click="$emit('create-reaction', { commentId: comment.id, reaction: 'heart' })"
            >
              <VssueIcon name="heart" />

              <span class="vssue-comment-reaction-number">
                {{ comment.reactions.heart }}
              </span>
            </span>

            <span
              class="vssue-comment-reaction"
              @click="$emit('create-reaction', { commentId: comment.id, reaction: '+1' })"
            >
              <VssueIcon name="like" />

              <span class="vssue-comment-reaction-number">
                {{ comment.reactions['+1'] }}
              </span>
            </span>

            <span
              class="vssue-comment-reaction"
              @click="$emit('create-reaction', { commentId: comment.id, reaction: '-1' })"
            >
              <VssueIcon name="unlike" />

              <span class="vssue-comment-reaction-number">
                {{ comment.reactions['-1'] }}
              </span>
            </span>
          </span>

          <span
            class="vssue-comment-reply"
            @click="$emit('reply', comment)"
          >
            Reply
          </span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import VssueIcon from './VssueIcon.vue'
import { formatDateTime } from '@vssue/utils'

export default {
  name: 'VssueComment',

  components: {
    VssueIcon,
  },

  props: {
    comment: {
      type: Object,
      required: true,
    },
  },

  computed: {
    content () {
      return this.comment.content
    },

    contentRaw () {
      return this.comment.contentRaw
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
    },
  },
}
</script>
