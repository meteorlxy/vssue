<template>
  <div class="vssue-comments">
    <!-- pagination top -->
    <VssuePagination />

    <!-- list of comments -->
    <TransitionFade group>
      <VssueComment
        v-for="comment in vssue.comments.data"
        :key="comment.id"
        :comment="comment"
      />
    </TransitionFade>

    <!-- pagination bottom - if too many comments -->
    <VssuePagination v-show="vssue.comments.data.length > 5" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject } from 'vue-property-decorator'
import { Vssue } from 'vssue'
import TransitionFade from './TransitionFade.vue'
import VssueComment from './VssueComment.vue'
import VssuePagination from './VssuePagination.vue'

@Component({
  components: {
    TransitionFade,
    VssueComment,
    VssuePagination,
  },
})
export default class VssueComments extends Vue {
  @Inject() vssue!: Vssue.Store
}
</script>
