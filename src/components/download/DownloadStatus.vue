<script setup lang="ts">
import { downloadTaskStatusMap, type DownloadTask } from 'bilitoolkit-types'
import { computed } from 'vue'

const props = defineProps<{
  task: DownloadTask
}>()

const type = computed<'primary' | 'success' | 'info' | 'warning' | 'danger'>(() => {
  switch (props.task.status) {
    case 'pending':
      return 'info'
    case 'downloading':
      return 'primary'
    case 'paused':
      return 'info'
    case 'canceled':
      return 'warning'
    case 'merging':
      return 'primary'
    case 'failed':
      return 'danger'
    case 'completed':
      return 'success'
    default:
      return 'info'
  }
})
const name = computed(() => downloadTaskStatusMap[props.task.status])
</script>

<template>
  <el-tag :type="type" disable-transitions size="small">{{ name }}</el-tag>
</template>

<style scoped lang="scss"></style>
