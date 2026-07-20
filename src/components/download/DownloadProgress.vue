<script setup lang="ts">
import type { DownloadTask } from 'bilitoolkit-types'
import { computed } from 'vue'
import { inArray } from '@ybgnb/utils'

const props = defineProps<{
  task: DownloadTask
}>()
const elStatus = computed<'success' | 'exception' | 'warning' | undefined>(() => {
  switch (props.task.status) {
    case 'failed':
      return 'exception'
    case 'completed':
      return 'success'
    default:
      return undefined
  }
})
const elStriped = computed(() => inArray(props.task.status, ['downloading', 'merging']))
</script>

<template>
  <el-progress
    :percentage="task.progress ? task.progress.percent : 0"
    :stroke-width="8"
    :show-text="true"
    :status="elStatus"
    :striped="elStriped"
    :striped-flow="elStriped"
    :duration="20"
  >
  </el-progress>
</template>

<style scoped lang="scss"></style>
