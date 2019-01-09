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
              v-for="reaction in ['heart', 'like', 'unlike']"
              :key="reaction"
              class="vssue-comment-reaction"
              @click="$emit('create-reaction', { commentId: comment.id, reaction: reaction })"
            >
              <VssueIcon :name="reaction" />

              <span class="vssue-comment-reaction-number">
                {{ comment.reactions[reaction] }}
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

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { VssueAPI } from 'vssue'
import { formatDateTime } from '@vssue/utils'
import VssueIcon from './VssueIcon.vue'

@Component({
  components: {
    VssueIcon,
  },
})
export default class VssueComment extends Vue {
  @Prop({
    type: Object,
    required: true,
  }) comment!: VssueAPI.Comment

  @Prop({
    type: Boolean,
    required: true,
  }) reactable!: boolean

  get content (): string {
    return this.comment.content
  }

  get contentRaw (): string {
    return this.comment.contentRaw
  }

  get author (): VssueAPI.User {
    return this.comment.author
  }

  get createdAt (): string {
    return formatDateTime(this.comment.createdAt)
  }

  get updatedAt (): string {
    return formatDateTime(this.comment.updatedAt)
  }

  get showReactions (): boolean {
    return this.reactable && Boolean(this.comment.reactions)
  }
}
</script>
