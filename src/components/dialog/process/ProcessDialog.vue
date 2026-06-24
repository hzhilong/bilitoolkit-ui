<!--加载框-->
<script setup lang="ts">
import { ref } from 'vue'
import { CircleCheck, CircleClose } from '@element-plus/icons-vue'
import type { ProcessDialogOptions, ProcessDialogStatus } from '@/components/dialog/process/types'

const visible = ref(false)
const message = ref('')
const percentage = ref(0)
const status = ref<ProcessDialogStatus>('loading')
const showCancel = ref(false)

let cancelHandler: (() => void | Promise<void>) | undefined
let confirmHandler: ((status: ProcessDialogStatus) => void | Promise<void>) | undefined

const show = (options: ProcessDialogOptions = {}) => {
  message.value = options.message ?? '加载中'
  showCancel.value = options.showCancel ?? false
  percentage.value = options.percentage ?? 0
  status.value = 'loading'
  cancelHandler = options.onCancel
  confirmHandler = options.onConfirm
  visible.value = true
}

const update = (currPct?: number, text?: string) => {
  if (currPct != null) {
    percentage.value = currPct
  }
  if (text != null) {
    message.value = text
  }
}

const setSuccess = (text = '操作成功') => {
  status.value = 'success'
  message.value = text
}

const setError = (text = '操作失败') => {
  status.value = 'error'
  message.value = text
}

const close = () => {
  visible.value = false
}

const handleCancel = async () => {
  await cancelHandler?.()
  close()
}

const handleConfirm = async () => {
  await confirmHandler?.(status.value)
  close()
}

defineExpose({
  show,
  update,
  setSuccess,
  setError,
  close,
})
</script>

<template>
  <div class="loading-mask el-overlay" v-show="visible">
    <div class="loading-content">
      <div class="options-close-btn" v-show="showCancel && status === 'loading'" @click="handleCancel"></div>
      <div class="status-icon">
        <el-progress v-if="status === 'loading'" type="circle" :percentage="percentage" :width="96" />
        <el-icon v-else-if="status === 'success'" :size="42">
          <CircleCheck style="color: var(--el-color-success)" />
        </el-icon>
        <el-icon v-else :size="42">
          <CircleClose style="color: var(--el-color-error)" />
        </el-icon>
      </div>

      <div class="loading-text">{{ message }}</div>

      <div class="actions">
        <el-button v-if="showCancel && status === 'loading'" @click="handleCancel"> 取消 </el-button>
        <el-button v-if="status !== 'loading'" type="primary" @click="handleConfirm"> 确定 </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--el-overlay-color-lighter);
  z-index: 9999;
  user-select: none;

  ::v-deep(.el-loading-mask) {
    background-color: unset !important;
  }

  .loading-content {
    min-width: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    background: var(--app-color-background);
    padding: 20px;
    border-radius: 10px;
    overflow: hidden;
    position: relative;

    .loading-spinner {
      width: var(--el-loading-spinner-size);
      height: var(--el-loading-spinner-size);
    }

    .loading-text {
      font-size: 16px;
      color: var(--el-text-color-regular);
    }
  }
}
</style>
