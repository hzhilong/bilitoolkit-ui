<script setup lang="ts">
import {
  type DownloadTask,
  type DownloadTaskFilters,
  type DownloadTaskStatus,
  downloadTaskStatusMap,
} from 'bilitoolkit-types'
import { ref, useTemplateRef, nextTick, onMounted, onUnmounted, computed } from 'vue'
import DownloadItem, { type DownloadTaskAction } from '@/components/download/DownloadItem.vue'
import { toolkitApi } from '@/api/toolkit-api'
import { handleOpenFolder, handlePause, handleResume, handleCancel, handleDelete } from '@/utils/download'
import DownloadDetailsDialog from '@/components/download/DownloadDetailsDialog.vue'
import { showToast } from '@/utils/feedback'
import type { PageParams } from '@/types/page'
import { usePageTable } from '@/composables/usePageTable'

const props = withDefaults(
  defineProps<{
    showDefaultActions?: boolean
    pageSizes?: number[]
  }>(),
  {
    showDefaultActions: true,
    pageSizes: () => [20, 40, 100],
  },
)
const refList = useTemplateRef<HTMLDivElement>('refList')
const pageParams = ref<PageParams>({
  pageNum: 1,
  pageSize: props.pageSizes[0],
})
const status = ref<DownloadTaskStatus | 'all'>('all')
const queryParams = ref<DownloadTaskFilters>({
  status: undefined,
  title: '',
})
const handleStatusChange = () => {
  if (status.value === 'all') {
    queryParams.value.status = undefined
  } else {
    queryParams.value.status = status.value
  }
  resetAndRefresh()
}

const {
  pageData,
  tableData,
  loading,
  refresh,
  resetAndRefresh,
  resetPageAndRefresh,
  handleSizeChange,
  handleCurrPageChange,
} = usePageTable<DownloadTask, DownloadTaskFilters>({
  fetchPage: toolkitApi.download.fetchPage,
  pageParams: () => pageParams.value,
  queryParams: () => queryParams.value,
  autoLoad: true,
  onLoaded: () => {
    nextTick(() => refList.value?.scrollTo(0, 0))
  },
})
const detailDialog = ref<{
  visible: boolean
  task?: DownloadTask
}>({
  visible: false,
})

const handleItemAction = async (action: DownloadTaskAction, task: DownloadTask) => {
  switch (action) {
    case 'show-details':
      detailDialog.value.task = task
      detailDialog.value.visible = true
      break
    case 'open-folder':
      await handleOpenFolder(task)
      break
    case 'pause':
      await handlePause(task)
      break
    case 'resume':
      await handleResume(task)
      break
    case 'cancel':
      await handleCancel(task)
      break
    case 'delete':
      await handleDelete(task)
      const index = tableData.value.findIndex((item) => item.id === task.id)
      if (index > -1) {
        tableData.value.splice(index, 1)
      }
      if (tableData.value.length < 1) {
        await resetPageAndRefresh()
      }
      showToast('删除任务成功')
      break
  }
}
let cancelUpdateListener: (() => void) | null = null
onMounted(async () => {
  cancelUpdateListener = await toolkitApi.download.onUpdated((update: DownloadTask) => {
    for (let i = 0; i < tableData.value.length; i++) {
      const task = tableData.value[i]
      if (task.id === update.id) {
        if (status.value === 'all' || task.status === update.status) {
          Object.assign(task, update)
        } else {
          tableData.value.splice(i, 1)
        }
        return
      }
    }
  })
})
onUnmounted(() => {
  cancelUpdateListener?.()
})
const emptyDesc = computed(() => {
  if (queryParams.value.status) {
    return `暂无${downloadTaskStatusMap[queryParams.value.status]}的任务`
  }
  return '暂无下载任务'
})
defineExpose({
  refresh,
  resetAndRefresh,
})
</script>

<template>
  <div class="header">
    <div class="query-list">
      <slot name="queryList">
        <el-radio-group v-model="status" size="small" @change="handleStatusChange">
          <el-radio-button label="全部" value="all" />
          <el-radio-button label="已完成" value="completed" />
          <el-radio-button label="下载中" value="downloading" />
          <el-radio-button label="暂停中" value="paused" />
          <el-radio-button label="已失败" value="failed" />
        </el-radio-group>
        <el-input
          v-model="queryParams.title"
          @change="resetPageAndRefresh"
          size="small"
          placeholder="标题"
          clearable
          style="width: 80px"
        ></el-input
      ></slot>
    </div>
    <div class="actions">
      <slot name="actions"></slot>
      <template v-if="showDefaultActions">
        <el-button size="small" @click="toolkitApi.download.pauseAll()">暂停所有任务</el-button>
        <el-button size="small" @click="toolkitApi.download.resumeAll()">继续所有任务</el-button>
      </template>
    </div>
  </div>
  <div class="download-list-container">
    <div ref="refList" class="download-list">
      <DownloadItem v-for="task in tableData" :task="task" :key="task.id" @action="handleItemAction">
        <template #titleExtra="slotProps">
          <slot name="itemTitleExtra" v-bind="slotProps" />
        </template>
      </DownloadItem>
      <el-empty v-if="!tableData.length" :description="emptyDesc"></el-empty>
    </div>
  </div>
  <el-pagination
    class="pagination"
    v-model:current-page="pageData.pageNum"
    v-model:page-size="pageData.pageSize"
    :page-sizes="pageSizes"
    :total="pageData.total"
    layout="total, sizes, prev, pager, next, jumper"
    @currentChange="handleCurrPageChange"
    @sizeChange="handleSizeChange"
  />
  <DownloadDetailsDialog v-model="detailDialog.visible" :task="detailDialog.task">
    <template v-if="detailDialog.task">
      <slot name="detailsDialog" :task="detailDialog.task"></slot>
    </template>
  </DownloadDetailsDialog>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  padding-bottom: 10px;

  .query-list,
  .actions {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }
  .query-list {
    gap: 20px;
  }
}
.download-list-container {
  flex: 1;
  min-height: 0;
  padding-right: 10px;
  display: flex;
  flex-direction: column;
}
.download-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  gap: 10px;
  padding: 10px;
  position: relative;
}

.pagination {
  margin-top: 10px;
}
</style>
