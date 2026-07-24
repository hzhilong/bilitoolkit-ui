<script setup lang="ts">
import { type DownloadTask } from 'bilitoolkit-types'
import { formatTime } from '@ybgnb/utils'
import { computed, useTemplateRef, watch, nextTick } from 'vue'
import DownloadStatus from '@/components/download/DownloadStatus.vue'
import DownloadProgress from '@/components/download/DownloadProgress.vue'
import DownloadProgressDetails from '@/components/download/DownloadProgressDetails.vue'
import DownloadResult from '@/components/download/DownloadResult.vue'
import DownloadVideoCard from '@/components/download/DownloadVideoCard.vue'
import { toolkitApi } from '@/api/toolkit-api'

const props = defineProps<{
  task?: DownloadTask
}>()

const visible = defineModel({ required: true, type: Boolean })
const videoCount = computed(() => {
  return props.task?.videos.reduce((sum, item) => sum + item.parts.length, 0) ?? 0
})
const resourceCount = computed(() => {
  return (
    props.task?.videos.reduce((sum, video) => sum + video.parts.reduce((s, part) => s + part.resources.length, 0), 0) ??
    0
  )
})
const refVideoList = useTemplateRef<HTMLDivElement>('refVideoList')

watch(
  () => visible.value,
  (newVal) => {
    if (newVal && refVideoList.value) {
      nextTick(() => {
        refVideoList.value?.scrollTo(0, 0)
      })
    }
  },
)

const handleOpenFolder = async (vi: number, pi: number) => {
  if (props.task) {
    await toolkitApi.download.openFolder(props.task.id, vi, pi)
  }
}
</script>

<template>
  <div class="task-modal">
    <el-dialog
      title="任务详情"
      v-model="visible"
      width="80%"
      style="max-height: 88vh"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      :show-close="true"
      align-center
    >
      <div class="dialog-content" v-if="task">
        <el-descriptions border :column="2">
          <el-descriptions-item label="任务 ID">{{ task.id }}</el-descriptions-item>
          <el-descriptions-item label="任务类型">{{ task.title }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatTime(task.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{
            task.updatedAt ? formatTime(task.updatedAt) : '-'
          }}</el-descriptions-item>
          <el-descriptions-item label="任务状态">
            <DownloadStatus :task="task"></DownloadStatus>
          </el-descriptions-item>
          <el-descriptions-item label="任务进度">
            <DownloadProgress v-if="task.progress" :task="task" />
            <span v-else>-</span>
          </el-descriptions-item>
          <el-descriptions-item label="进度详情" :span="2" v-if="task.progress">
            <DownloadProgressDetails :task="task" :resourceCount="resourceCount" />
          </el-descriptions-item>
          <el-descriptions-item label="任务结果" :span="2" v-if="task.result">
            <DownloadResult :task="task" :videoCount="videoCount" :resourceCount="resourceCount" />
          </el-descriptions-item>
          <el-descriptions-item label="错误信息" :span="2" v-if="task.error" style="color: var(--el-color-danger)">
            {{ task.error }}
          </el-descriptions-item>
          <el-descriptions-item label="操作用户">
            <div class="uid-icon" style="display: inline-block"></div>
            {{ task.userCookie.uid }}
          </el-descriptions-item>
          <slot></slot>
        </el-descriptions>
        <div class="video-list-container">
          <div class="header">视频列表：</div>
          <div class="video-list" ref="refVideoList">
            <div class="video-item" v-for="(v, i) in task.videos" :key="v.snapshot.aid">
              <div class="header">
                <span>#{{ i + 1 }}</span>
              </div>
              <DownloadVideoCard :video="v" @openFolder="(pi: number) => handleOpenFolder(i, pi)"></DownloadVideoCard>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer"></div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.task-modal {
  display: contents;

  ::v-deep(> .el-modal-dialog > .el-overlay-dialog > .el-dialog) {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .el-dialog__body {
      flex: 1;
      min-height: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
  }

  ::v-deep(.el-descriptions__label) {
    text-wrap: nowrap;
  }
  .dialog-content {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .video-list-container {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      .header {
        font-size: 14px;
        color: var(--el-text-color-primary);
        margin-bottom: 6px;
      }

      .video-list {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow: auto;
        padding-right: 7px;
        gap: 12px;

        .video-item {
          border: 1px solid var(--el-border-color);
          border-radius: 8px;
          padding: 10px 16px;

          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        }
      }
    }
  }
}
</style>
