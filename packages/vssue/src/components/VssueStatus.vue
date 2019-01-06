<template>
  <div class="vssue-status">
    <VssueIcon
      v-if="iconName"
      :name="iconName"
      :size="iconSize"
    />

    <p>
      <slot />
    </p>
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
export default class VssueStatus extends Vue {
  @Prop({
    type: String,
    required: false,
    default: null,
  }) iconName!: string | null

  @Prop({
    type: String,
    required: false,
    default: '20px',
  }) iconSize!: string
}
</script>
