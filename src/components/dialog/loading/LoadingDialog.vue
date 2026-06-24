<!--加载框-->
<script setup lang="ts">
import { ref } from 'vue'
import type { LoadingDialogOptions } from '@/components/dialog/loading/types'

const visible = ref(false)
const message = ref('')
const showCancel = ref(false)

let cancelHandler: (() => void | Promise<void>) | undefined

const show = (options: LoadingDialogOptions = {}) => {
  message.value = options.message ?? '加载中'
  showCancel.value = options.showCancel ?? false
  cancelHandler = options.onCancel

  if (options?.autoCloseDelay) {
    setTimeout(() => {
      close()
    }, options?.autoCloseDelay)
  }

  visible.value = true
}

const update = (text: string) => {
  message.value = text
}

const close = () => {
  visible.value = false
}

const handleCancel = async () => {
  await cancelHandler?.()
  close()
}

defineExpose({
  show,
  update,
  close,
})
</script>

<template>
  <div class="loading-mask el-overlay" v-show="visible">
    <div class="loading-content">
      <div class="options-close-btn" v-show="showCancel" @click="handleCancel"></div>
      <div class="loading-spinner" v-loading="true"></div>

      <div class="loading-text">{{ message }}</div>
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
