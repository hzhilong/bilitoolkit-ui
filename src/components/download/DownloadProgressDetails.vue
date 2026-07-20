<script setup lang="ts">
import { type DownloadTask } from 'bilitoolkit-types'
import { formatSpeed, formatBytes } from '@/utils/format'

defineProps<{
  task: DownloadTask
  resourceCount: number
  isCompact?: boolean
}>()
</script>

<template>
  <div class="download-progress-details" :style="{ gap: isCompact ? '10px' : '20px' }">
    <template v-if="task.progress">
      <div class="detail-item">
        <span class="label">速度：</span>
        <span class="value">{{ formatSpeed(task.progress.speedKBps) }}</span>
      </div>
      <div class="detail-item">
        <span class="label">文件：</span>
        <div class="value">
          <span>{{ task.progress?.currentItem }}</span>
          <span> / </span>
          <span>{{ resourceCount }}</span>
        </div>
      </div>
      <div class="detail-item">
        <span class="label">已完成：</span>
        <div class="value">
          <span>{{ formatBytes(task.progress.completedBytes) }}</span>
          <span> / </span>
          <span>{{ formatBytes(task.progress.totalBytes) }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.download-progress-details {
  display: flex;
  align-items: center;
  font-size: 13px;

  .detail-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }
}
</style>
