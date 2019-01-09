<template>
  <div class="vssue-comments">
    <TransitionFade>
      <VssueStatus
        v-if="failed"
        key="failed"
        icon-name="error"
      >
        Failed to load comments
      </VssueStatus>

      <VssueStatus
        v-else-if="requireLogin"
        key="requie-login"
      >
        Login to view comments
      </VssueStatus>

      <VssueStatus
        v-else-if="!comments"
        key="loading"
        icon-name="loading"
      >
        Loading comments...
      </VssueStatus>

      <VssueStatus
        v-else-if="comments.data.length === 0"
        key="no-comments"
      >
        No comments yet. Leave the first comment !
      </VssueStatus>

      <div
        v-else
        key="comments-list"
        class="vssue-comments-list"
      >
        <VssuePagination
          :count="comments.count"
          :page="page"
          :per-page="perPage"
          :sort="sort"
          :sortable="sortable"
          :loading="loading"
          @update:page="val => $emit('update:page', val)"
          @update:perPage="val => $emit('update:perPage', val)"
          @update:sort="val => $emit('update:sort', val)"
        />

        <TransitionFade group>
          <VssueComment
            v-for="comment in comments.data"
            :key="comment.id"
            :comment="comment"
            :reactable="reactable"
            @reply="comment => $emit('reply', comment)"
            @create-reaction="reaction => $emit('create-reaction', reaction)"
          />
        </TransitionFade>

        <VssuePagination
          v-show="comments.data.length > 5"
          :count="comments.count"
          :page="page"
          :per-page="perPage"
          :sort="sort"
          :sortable="sortable"
          :loading="loading"
          @update:page="val => $emit('update:page', val)"
          @update:perPage="val => $emit('update:perPage', val)"
          @update:sort="val => $emit('update:sort', val)"
        />
      </div>
    </TransitionFade>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { VssueAPI } from 'vssue'
import TransitionFade from './TransitionFade.vue'
import VssueComment from './VssueComment.vue'
import VssuePagination from './VssuePagination.vue'
import VssueStatus from './VssueStatus.vue'

@Component({
  components: {
    TransitionFade,
    VssueComment,
    VssuePagination,
    VssueStatus,
  },
})
export default class VssueComments extends Vue {
  @Prop({
    type: Object,
    required: false,
    default: null,
  }) comments!: VssueAPI.Comments | null

  @Prop({
    type: Boolean,
    required: true,
  }) reactable!: boolean

  @Prop({
    type: Boolean,
    required: true,
  }) sortable!: boolean

  @Prop({
    type: Boolean,
    required: true,
  }) failed!: boolean

  @Prop({
    type: Boolean,
    required: true,
  }) loading!: boolean

  @Prop({
    type: Boolean,
    required: true,
  }) requireLogin!: boolean

  @Prop({
    type: Number,
    required: true,
  }) page!: number

  @Prop({
    type: Number,
    required: true,
  }) perPage!: number

  @Prop({
    type: String,
    required: true,
  }) sort!: string
}
</script>
