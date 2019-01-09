<template>
  <div
    v-if="count > perPageOptions[0]"
    class="vssue-pagination"
  >
    <div class="vssue-pagination-per-page">
      <select
        class="vssue-pagination-select"
        :disabled="loading"
        v-model="perPageInternal"
      >
        <option
          v-for="val in perPageOptions"
          :key="val"
          :value="val">
          {{ val }}
        </option>
      </select>

      <span>
        Comments per page
      </span>

      <span
        v-if="sortable"
        :class="{
          'vssue-pagination-link': true,
          'disabled': loading,
        }"
        :title="`Click to change the sort direction`"
        @click="$emit('update:sort', sort === 'asc' ? 'desc' : 'asc')"
      >
        {{ sort === 'asc' ? `↑` : `↓` }}
      </span>
    </div>

    <div class="vssue-pagination-page">
      <span
        :class="{
          'vssue-pagination-link': true,
          'disabled': pageInternal === 1 || loading,
        }"
        :title="`Previous Page`"
        @click="pageInternal -= 1"
        v-text="`<`"
      />

      <span>
        Page
      </span>

      <select
        v-show="pageCount > 1"
        class="vssue-pagination-select"
        :disabled="loading"
        v-model="pageInternal"
      >
        <option
          v-for="val in pageCount"
          :key="val"
          :value="val">
          {{ val }}
        </option>
      </select>

      <span
        v-show="pageCount < 2"
        v-text="page"
      />

      <span v-text="` / ${pageCount} `"/>

      <span
        :class="{
          'vssue-pagination-link': true,
          'disabled': pageInternal === pageCount || loading,
        }"
        :title="`Next Page`"
        @click="pageInternal += 1"
        v-text="`>`"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import VssueIcon from './VssueIcon.vue'

@Component({
  components: {
    VssueIcon,
  },
})
export default class VssuePagination extends Vue {
  @Prop({
    type: Boolean,
    required: true,
  }) sortable!: boolean

  @Prop({
    type: Boolean,
    required: true,
  }) loading!: boolean

  @Prop({
    type: Number,
    required: true,
  }) count!: number

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

  get pageCount (): number {
    return Math.ceil(this.count / this.perPage)
  }

  get perPageOptions (): Array<number> {
    const perPageOptions: Array<number> = [5, 10, 20, 50]
    if (!perPageOptions.includes(this.perPage) && this.perPage < 100) {
      perPageOptions.push(this.perPage)
    }
    return perPageOptions.sort((a, b) => a - b)
  }

  get pageInternal (): number {
    return this.page
  }

  set pageInternal (val) {
    if (val > 0 && val <= this.pageCount) {
      this.$emit('update:page', val)
    }
  }

  get perPageInternal (): number {
    return this.perPage
  }

  set perPageInternal (val) {
    this.$emit('update:perPage', val)
  }
}
</script>
