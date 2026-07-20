<script setup lang="ts">
import { computed } from 'vue'
import { Picture } from '@element-plus/icons-vue'
import type { DownloadTask } from 'bilitoolkit-types'
import DownloadStatus from './DownloadStatus.vue'
import { AppTooltip } from 'bilitoolkit-ui'
import { formatTime, formatDuration } from '@ybgnb/utils'
import DownloadProgress from '@/components/download/DownloadProgress.vue'
import DownloadProgressDetails from '@/components/download/DownloadProgressDetails.vue'
import DownloadResult from '@/components/download/DownloadResult.vue'

export type DownloadTaskAction = 'pause' | 'resume' | 'cancel' | 'delete' | 'open-folder' | 'show-details'

const props = defineProps<{
  task: DownloadTask
}>()

defineEmits<{
  (e: 'action', action: DownloadTaskAction, task: DownloadTask): void
}>()

const coverUrl = computed(() => {
  return props.task.videos[0].snapshot.pic
})
const videoCount = computed(() => {
  return props.task.videos.reduce((sum, item) => sum + item.parts.length, 0)
})
const resourceCount = computed(() =>
  props.task.videos.reduce((sum, video) => sum + video.parts.reduce((s, part) => s + part.resources.length, 0), 0),
)
const totalDuration = computed(() =>
  props.task.videos.reduce((sum, video) => sum + video.parts.reduce((s, part) => s + part.snapshot.duration, 0), 0),
)
</script>

<template>
  <div class="download-task-card">
    <div class="cover">
      <div class="cover-image">
        <el-image :src="coverUrl" fit="cover">
          <template #error>
            <div class="cover-placeholder">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-image>
        <div class="download-cover-stats">
          <span></span>
          <span class="download-stats__duration">{{ formatDuration(totalDuration) }}</span>
        </div>
      </div>
      <span class="time">{{ formatTime(task.createdAt) }}</span>
    </div>

    <div class="content">
      <div class="header">
        <AppTooltip class="title" :content="task.title">{{ task.title }}</AppTooltip>
        <DownloadStatus :task="task" />
        <slot name="titleExtra" :task="task" />
      </div>
      <DownloadProgress :task="task" />
      <DownloadProgressDetails :task="task" :resourceCount="resourceCount" />
      <DownloadResult :task="task" :videoCount="videoCount" :resourceCount="resourceCount" />
      <AppTooltip class="error" v-if="task.error" :content="task.error">{{ task.error }}</AppTooltip>
      <div class="actions">
        <el-button size="small" @click="$emit('action', 'show-details', task)"> 详情 </el-button>
        <el-button size="small" @click="$emit('action', 'open-folder', task)"> 打开文件夹 </el-button>

        <template v-if="task.status === 'downloading'">
          <el-button size="small" @click="$emit('action', 'pause', task)"> 暂停 </el-button>
        </template>
        <template v-if="task.status === 'paused' || task.status === 'pending'">
          <el-button size="small" @click="$emit('action', 'cancel', task)"> 取消 </el-button>
        </template>

        <template v-if="task.status === 'paused'">
          <el-button size="small" @click="$emit('action', 'resume', task)"> 继续 </el-button>
        </template>

        <el-button size="small" @click="$emit('action', 'delete', task)"> 删除 </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.download-task-card {
  width: 100%;
  display: flex;
  align-items: stretch;
  gap: 16px;
  box-shadow:
    0 1px 3px var(--app-color-foreground-transparent-6),
    0 4px 12px var(--app-color-foreground-transparent-4);
  border: 1px solid var(--el-border-color);
  transition: box-shadow 0.25s ease;
  padding: 16px 16px;
  border-radius: 12px;

  &:hover {
    box-shadow:
      0 2px 8px var(--app-color-foreground-transparent-8),
      0 8px 24px var(--app-color-foreground-transparent-6);
  }
}

.cover {
  width: 144px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  gap: 4px;

  .cover-image {
    width: 144px;
    aspect-ratio: 16/9;
    border-radius: 6px;
    overflow: hidden;
    background: var(--el-fill-color-light);
    position: relative;
  }

  .cover-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: var(--el-text-color-placeholder);
  }

  .time {
    color: var(--el-text-color-regular);
  }

  .download-cover-stats {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 2;
    box-sizing: border-box;
    padding: 16px 8px 6px;
    width: 100%;
    height: 38px;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    background-image: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
    color: #fff;
    font-size: 13px;
    line-height: 18px;
    opacity: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
  max-width: 100%;

  .title {
    flex-grow: 1;
    min-width: 0;
    font-size: 16px;
    font-weight: 600;
  }
}

.error {
  font-size: 13px;
  line-height: 1.6;
  color: var(--el-color-danger);
}

.actions {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
}
</style>
