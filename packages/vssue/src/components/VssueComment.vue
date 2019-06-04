<template>
  <div
    class="vssue-comment"
    :class="{
      'vssue-comment-edit-mode': editMode,
      'vssue-comment-disabled': isDeletingComment || isPutingComment,
    }"
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
          <textarea
            ref="input"
            v-if="editMode"
            class="vssue-edit-comment-input"
            :rows="editInputRows"
            v-model="editContent"
            @keyup.enter.ctrl="putComment()"
          />
          <article
            v-else
            class="markdown-body"
            v-html="content"
          />
        </div>

        <div class="vssue-comment-footer">
          <!-- edit mode hint -->
          <span
            v-if="editMode"
            class="vssue-comment-hint"
          >
            {{ vssue.$t('editMode') }}
          </span>

          <!-- reactions -->
          <span
            v-if="showReactions"
            class="vssue-comment-reactions"
          >
            <span
              v-for="reaction in reactionKeys"
              :key="reaction"
              class="vssue-comment-reaction"
              :title="vssue.$t(creatingReactions.includes(reaction) ? 'loading' : reaction)"
              @click="postReaction({ reaction: reaction })"
            >
              <VssueIcon
                :name="creatingReactions.includes(reaction) ? 'loading' : reaction"
                :title="vssue.$t(creatingReactions.includes(reaction) ? 'loading' : reaction)"
              />

              <span class="vssue-comment-reaction-number">
                {{ comment.reactions[reaction] }}
              </span>
            </span>
          </span>

          <!-- operations -->
          <span class="vssue-comment-operations">
            <span
              v-if="comment.author.username === currentUser && editMode"
              class="vssue-comment-operation"
              :class="{ 'vssue-comment-operation-muted': isPutingComment }"
              :title="vssue.$t(isPutingComment ? 'loading' : 'submit')"
              @click="putComment()"
            >
              <VssueIcon
                v-show="isPutingComment"
                name="loading"
                :title="vssue.$t('loading')"
              />

              {{ vssue.$t('submit') }}
            </span>

            <span
              v-if="comment.author.username === currentUser && editMode"
              class="vssue-comment-operation vssue-comment-operation-muted"
              :title="vssue.$t('cancel')"
              @click="resetEdit()"
            >
              {{ vssue.$t('cancel') }}
            </span>

            <span
              v-if="comment.author.username === currentUser"
              v-show="!editMode"
              class="vssue-comment-operation"
              @click="enterEdit()"
            >
              <VssueIcon
                name="edit"
                :title="vssue.$t('edit')"
              />
            </span>

            <span
              v-if="comment.author.username === currentUser || vssue.isAdmin"
              v-show="!editMode"
              class="vssue-comment-operation"
              @click="deleteComment()"
            >
              <VssueIcon
                :name="isDeletingComment ? 'loading' : 'delete'"
                :title="vssue.$t(isDeletingComment ? 'loading' : 'delete')"
              />
            </span>

            <span
              v-show="!editMode"
              class="vssue-comment-operation"
              @click="vssue.$emit('reply-comment', comment)"
            >
              <VssueIcon
                name="reply"
                :title="vssue.$t('reply')"
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

  editMode: boolean = false
  editContent: string = this.comment.contentRaw

  creatingReactions: Array<keyof VssueAPI.Reactions> = []
  isPutingComment: boolean = false
  isDeletingComment: boolean = false

  get currentUser (): string | null {
    return this.vssue.user ? this.vssue.user.username : null
  }

  get content (): string {
    return this.comment.content
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
    return Boolean(this.vssue.API && this.vssue.API.platform.meta.reactable && this.comment.reactions && !this.editMode)
  }

  get reactionKeys (): Array<keyof VssueAPI.Reactions> {
    return ['heart', 'like', 'unlike']
  }

  get editContentRows (): number {
    return this.editContent.split('\n').length - 1
  }

  get editInputRows (): number {
    return this.editContentRows < 3 ? 5 : this.editContentRows + 2
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
        this.vssue.$emit('error', new Error(this.vssue.$t('reactionGiven', { reaction: this.vssue.$t(reaction) }) as string))
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

  enterEdit (this: any): void {
    this.editMode = true
    this.$nextTick(() => {
      this.$refs.input.focus()
    })
  }

  resetEdit (): void {
    this.editMode = false
    this.editContent = this.comment.contentRaw
  }

  async putComment (): Promise<void> {
    try {
      if (this.vssue.isPending) return

      if (this.editContent !== this.comment.contentRaw) {
        this.isPutingComment = true
        this.vssue.isUpdatingComment = true

        const comment = await this.vssue.putComment({
          commentId: this.comment.id,
          content: this.editContent,
        })

        if (comment) {
          this.vssue.comments!.data.splice(this.vssue.comments!.data.findIndex(item => item.id === this.comment.id), 1, comment)
        }
      }

      this.editMode = false
    } finally {
      this.isPutingComment = false
      this.vssue.isUpdatingComment = false
    }
  }

  async deleteComment (): Promise<void> {
    try {
      if (this.vssue.isPending) return

      if (!window.confirm(this.vssue.$t('deleteConfirm') as string)) return

      this.isDeletingComment = true
      this.vssue.isUpdatingComment = true

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
        this.vssue.$emit('error', new Error(this.vssue.$t('deleteFailed') as string))
      }
    } finally {
      this.isDeletingComment = false
      this.vssue.isUpdatingComment = false
    }
  }
}
</script>
