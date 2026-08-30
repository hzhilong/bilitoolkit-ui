<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [value: [Date, Date]]
  cancel: []
}>()

const value = ref<[Date, Date] | null>(null)

function handleConfirm() {
  if (!value.value || value.value.length !== 2) {
    return
  }

  emit('confirm', value.value)
}

function handleCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}

function handleClose() {
  handleCancel()
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    title="选择日期时间范围"
    width="500px"
    :close-on-click-modal="false"
    destroy-on-close
    @close="handleClose"
  >
    <el-date-picker
      v-model="value"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      format="YYYY-MM-DD HH:mm:ss"
      value-format="x"
      style="width: 100%"
    />

    <template #footer>
      <el-button @click="handleCancel"> 取消 </el-button>

      <el-button type="primary" :disabled="!value" @click="handleConfirm"> 确定 </el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
