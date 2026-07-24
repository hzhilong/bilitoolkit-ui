<script setup lang="ts">
import type { DownloadTask } from 'bilitoolkit-types'
import { formatBytes } from '@/utils/format'

defineProps<{
  task: DownloadTask
  videoCount: number
  resourceCount: number
}>()
</script>

<template>
  <div class="download-result">
    <span class="hint">总共：</span>
    <span class="detail-item" v-if="task.result">
      <span> {{ formatBytes(task.result.totalBytes) }}</span>
    </span>
    <span class="detail-item">
      <AppIcon icon="video" />
      <span> {{ videoCount }} 个视频</span>
    </span>
    <span class="detail-item">
      <AppIcon icon="file" />
      <span> {{ resourceCount }} 个文件</span>
    </span>
  </div>
</template>

<style scoped lang="scss">
.download-result {
  display: flex;
  align-items: center;
  font-size: 13px;

  .hint {
    margin-right: 6px;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 2px;
    margin-right: 20px;
  }
}
</style>
