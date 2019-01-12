<template>
  <div
    class="vssue-comment"
    :class="{ 'disabled': isDeletingComment }"
  >
    <!-- avatar -->
    <div class="vssue-comment-avatar">
      <a
        :href="author.homepage"
        :title="author.username"
        target="_blank"
      >
        <img :src="author.avatar">
      </a>
    </div>

    <!-- comment -->
    <div class="vssue-comment-body">
      <slot name="body">
        <div class="vssue-comment-header">
          <!-- author - username - link to profile page -->
          <span class="vssue-comment-author">
            <a
              :href="author.homepage"
              :title="author.username"
              target="_blank"
            >
              {{ author.username }}
            </a>
          </span>

          <!-- created-at -->
          <span class="vssue-comment-created-at">
            {{ createdAt }}
          </span>
        </div>

        <!-- comment content - html string - we trust platform api so use v-html -->
        <div class="vssue-comment-main">
          <article
            class="markdown-body"
            v-html="content"
          />
        </div>

        <div class="vssue-comment-footer">
          <!-- reactions -->
          <span
            v-if="showReactions"
            class="vssue-comment-reactions"
          >
            <span
              v-for="reaction in reactionKeys"
              :key="reaction"
              class="vssue-comment-reaction"
              :title="reaction"
              @click="postReaction({ reaction: reaction })"
            >
              <VssueIcon
                :name="creatingReactions.includes(reaction) ? 'loading' : reaction"
                :title="creatingReactions.includes(reaction) ? 'loading' : reaction"
              />

              <span class="vssue-comment-reaction-number">
                {{ comment.reactions[reaction] }}
              </span>
            </span>
          </span>

          <!-- operations -->
          <span class="vssue-comment-operations">
            <span
              v-if="comment.author.username === currentUser"
              class="vssue-comment-operation"
              @click="deleteComment()"
            >
              <VssueIcon
                :name="isDeletingComment ? 'loading' : 'delete'"
                :title="isDeletingComment ? `Deleting` : `Delete`"
              />
            </span>

            <span
              class="vssue-comment-operation"
              @click="vssue.$emit('reply-comment', comment)"
            >
              <VssueIcon
                name="reply"
                :title="`Reply`"
              />
            </span>
          </span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject } from 'vue-property-decorator'
import { VssueAPI, Vssue } from 'vssue'
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

  @Inject() vssue!: Vssue.Store

  creatingReactions: Array<keyof VssueAPI.Reactions> = []

  isDeletingComment: boolean = false

  get currentUser (): string | null {
    return this.vssue.user ? this.vssue.user.username : null
  }

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
    return Boolean(this.vssue.API && this.vssue.API.platform.meta.reactable && this.comment.reactions)
  }

  get reactionKeys (): Array<keyof VssueAPI.Reactions> {
    return ['heart', 'like', 'unlike']
  }

  async postReaction ({
    reaction,
  }: {
    reaction: keyof VssueAPI.Reactions
  }): Promise<void> {
    try {
      if (this.creatingReactions.includes(reaction)) return

      this.creatingReactions.push(reaction)

      const success = await this.vssue.postCommentReaction({
        commentId: this.comment.id,
        reaction,
      })

      if (!success) {
        this.vssue.$emit('error', new Error('Already given this reaction'))
      }

      // always refresh reactions even already given
      const reactions = await this.vssue.getCommentReactions({
        commentId: this.comment.id,
      })
      if (reactions) {
        this.comment.reactions = reactions
      }
    } finally {
      this.creatingReactions.splice(this.creatingReactions.findIndex(item => item === reaction), 1)
    }
  }

  async deleteComment (): Promise<void> {
    try {
      if (this.isDeletingComment) return

      if (!window.confirm('Confirm to delete this comment?')) return

      this.isDeletingComment = true

      const success = await this.vssue.deleteComment({
        commentId: this.comment.id,
      })

      if (success) {
        // decrease count immediately
        this.vssue.comments!.count -= 1

        // if there are more than one comment on this page, remove the deleted comment immediately
        if (this.vssue.comments!.data.length > 1) {
          this.vssue.comments!.data.splice(this.vssue.comments!.data.findIndex(item => item.id === this.comment.id), 1)
        }

        // if the page count should be decreased, change the query param to trigger comments reload
        if (this.vssue.query.page > 1 && this.vssue.query.page > Math.ceil(this.vssue.comments!.count / this.vssue.query.perPage)) {
          this.vssue.query.page -= 1
        } else {
          await this.vssue.getComments()
        }
      } else {
        this.vssue.$emit('error', new Error('Failed to delete comment'))
      }
    } finally {
      this.isDeletingComment = false
    }
  }
}
</script>
