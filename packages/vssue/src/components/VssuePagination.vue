<template>
  <div class="vssue-pagination">
    <div class="vssue-pagination-per-page">
      <select
        class="vssue-pagination-select"
        :disabled="disabled"
        v-model="perPage"
      >
        <option
          v-for="val in perPageOptions"
          :key="val"
          :value="val"
        >
          {{ val }}
        </option>
      </select>

      <span>
        {{ vssue.$t('perPage') }}
      </span>

      <span
        v-if="vssue.API.platform.meta.sortable"
        :class="{
          'vssue-pagination-link': true,
          'disabled': disabled,
        }"
        :title="vssue.$t('sort')"
        @click="vssue.query.sort = (vssue.query.sort === 'asc' ? 'desc' : 'asc')"
      >
        {{ vssue.query.sort === 'asc' ? `↑` : `↓` }}
      </span>
    </div>

    <div class="vssue-pagination-page">
      <span
        :class="{
          'vssue-pagination-link': true,
          'disabled': page === 1 || disabled,
        }"
        :title="vssue.$t('prev')"
        @click="page -= 1"
        v-text="`<`"
      />

      <span>
        {{ vssue.$t('page') }}
      </span>

      <select
        v-show="pageCount > 1"
        class="vssue-pagination-select"
        :disabled="disabled"
        v-model="page"
      >
        <option
          v-for="val in pageCount"
          :key="val"
          :value="val"
        >
          {{ val }}
        </option>
      </select>

      <span
        v-show="pageCount < 2"
        v-text="page"
      />

      <span v-text="` / ${pageCount} `" />

      <span
        :class="{
          'vssue-pagination-link': true,
          'disabled': page === pageCount || disabled,
        }"
        :title="vssue.$t('next')"
        @click="page += 1"
        v-text="`>`"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject } from 'vue-property-decorator'
import { Vssue } from 'vssue'
import VssueIcon from './VssueIcon.vue'

@Component({
  components: {
    VssueIcon,
  },
})
export default class VssuePagination extends Vue {
  @Inject() vssue!: Vssue.Store

  get disabled (): boolean {
    return this.vssue.isPending
  }

  get pageCount (): number {
    const pageCount = Math.ceil(this.vssue.comments!.count / this.vssue.comments!.perPage)
    return pageCount > 1 ? pageCount : 1
  }

  get perPageOptions (): Array<number> {
    const perPageOptions: Array<number> = [5, 10, 20, 50]
    if (!perPageOptions.includes(this.vssue.options!.perPage) && this.vssue.options!.perPage < 100) {
      perPageOptions.push(this.vssue.options!.perPage)
    }
    return perPageOptions.sort((a, b) => a - b)
  }

  get page (): number {
    return this.vssue.query.page > this.pageCount ? this.pageCount : this.vssue.query.page
  }

  set page (val: number) {
    if (val > 0 && val <= this.pageCount) {
      this.vssue.query.page = val
    }
  }

  get perPage (): number {
    return this.vssue.query.perPage
  }

  set perPage (val: number) {
    if (this.perPageOptions.includes(val)) {
      this.vssue.query.perPage = val
    }
  }
}
</script>
