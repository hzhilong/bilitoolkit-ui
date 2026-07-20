<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="420px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="onCancel"
  >
    <div>{{ message }}</div>

    <el-checkbox v-model="deleteSourceFile" style="margin-top: 16px" @change="saveCheckbox">
      同时删除本地磁盘源文件
    </el-checkbox>

    <template #footer>
      <el-button @click="onCancel">
        {{ cancelButtonText }}
      </el-button>

      <el-button type="danger" @click="onConfirm">
        {{ confirmButtonText }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const STORAGE_KEY = 'delete-confirm-dialog:delete-source-file'

withDefaults(
  defineProps<{
    visible: boolean
    title?: string
    message: string
    confirmButtonText?: string
    cancelButtonText?: string
  }>(),
  {
    title: '提示',
    confirmButtonText: '删除',
    cancelButtonText: '取消',
  },
)

const emit = defineEmits<{
  (e: 'confirm', deleteSourceFile: boolean): void
  (e: 'cancel'): void
}>()

const deleteSourceFile = ref(localStorage.getItem(STORAGE_KEY) === 'true')

function saveCheckbox() {
  localStorage.setItem(STORAGE_KEY, String(deleteSourceFile.value))
}

function onConfirm() {
  emit('confirm', deleteSourceFile.value)
}

function onCancel() {
  emit('cancel')
}
</script>
