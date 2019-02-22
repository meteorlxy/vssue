<template>
  <div class="vssue-notice">
    <div
      v-show="progress.show"
      class="vssue-progress"
      :style="{
        'width': `${progress.percent}%`,
        'transition': `all ${progress.speed}ms linear`,
      }"
    />

    <TransitionFade>
      <div
        v-show="alert.show"
        class="vssue-alert"
        @click="alertHide()"
        v-text="alert.message"
      />
    </TransitionFade>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject, Watch } from 'vue-property-decorator'
import { Vssue } from 'vssue'
import TransitionFade from './TransitionFade.vue'

@Component({
  components: {
    TransitionFade,
  },
})
export default class VssueNotice extends Vue {
  @Inject() vssue!: Vssue.Store

  // progress data
  progress: {
    show: boolean
    percent: number
    timer: number | null
    speed: number
  } = {
    show: false,
    percent: 0,
    timer: null,
    speed: 200,
  }

  // alert data
  alert: {
    show: boolean
    message: string | null
    timer: number | null
  } = {
    show: false,
    message: null,
    timer: null,
  }

  /**
   * Show progress when loading comments
   */
  @Watch('vssue.isLoadingComments')
  onLoadingCommentsChange (val: boolean): void {
    if (this.vssue.comments) {
      if (val) {
        this.progressStart()
      } else {
        this.progressDone()
      }
    }
  }

  created () {
    this.vssue.$on('error', e => this.alertShow(e.message))
  }

  beforeDestroy () {
    this.vssue.$off('error')
    if (this.progress.timer !== null) window.clearTimeout(this.progress.timer)
    if (this.alert.timer !== null) window.clearTimeout(this.alert.timer)
  }

  /**
   * Progress start
   */
  progressStart () {
    this.progress.show = true
    this.progress.percent = 0
    this.progress.timer = window.setInterval(() => {
      this.progress.percent += 5
      if (this.progress.percent > 94) {
        if (this.progress.timer !== null) window.clearInterval(this.progress.timer)
      }
    }, this.progress.speed)
  }

  /**
   * Progress stop
   */
  progressDone () {
    this.progress.percent = 100
    if (this.progress.timer !== null) window.clearTimeout(this.progress.timer)
    this.progress.timer = null
    window.setTimeout(() => {
      this.progress.show = false
    }, this.progress.speed)
  }

  /**
   * Show alert message
   */
  alertShow (content): void {
    this.alert.show = true
    this.alert.message = content
    if (this.alert.timer !== null) window.clearTimeout(this.alert.timer)
    this.alert.timer = window.setTimeout(() => {
      this.alertHide()
    }, 3000)
  }

  /**
   * Hide alert message
   */
  alertHide (): void {
    this.alert.show = false
    if (this.alert.timer !== null) window.clearTimeout(this.alert.timer)
    this.alert.timer = null
  }
}
</script>
