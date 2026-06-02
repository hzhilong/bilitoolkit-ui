<script setup lang="ts">
import { watch, computed, ref } from 'vue'
import type { PageRangeDialogProps } from '@/components/dialog/page-range/types'

const props = withDefaults(defineProps<PageRangeDialogProps>(), {
  title: '请选择页码范围',
  confirmText: '确定',
  cancelText: '取消',
  minPage: 1,
  defaultRange: () => [1, 1],
})

const visible = defineModel<boolean>({ required: true })
const maxPageNum = computed(() => {
  if (props.total != null && props.maxPage != null) {
    return Math.min(props.maxPage, Math.ceil(props.total / props.pageSize))
  } else if (props.total != null) {
    return Math.ceil(props.total / props.pageSize)
  } else {
    return props.maxPage
  }
})
const startPage = ref(1)
const endPage = ref(1)

const totalDesc = computed(() => `共有 ${props.total} 条数据`)
const pageSizeDesc = computed(() => `每页可获取 ${props.pageSize} 条数据`)
const rangeSizeDesc = computed(() => {
  if (props.total != null) {
    const finalPageSize = props.pageSize - Math.max(endPage.value * props.pageSize - props.total, 0)
    const size = (endPage.value - startPage.value) * props.pageSize + finalPageSize
    return `共选择 ${size} 条数据`
  } else {
    return `共选择 ${(endPage.value + 1 - startPage.value) * props.pageSize} 条数据`
  }
})

watch(
  visible,
  async (newVal) => {
    if (newVal) {
      startPage.value = props.defaultRange[0]
      endPage.value = props.defaultRange[1]
    }
  },
  { immediate: true },
)

const emits = defineEmits<{
  confirm: [range: [number, number]]
}>()
const handleCancel = () => {
  visible.value = false
}
const handleSubmit = () => {
  emits('confirm', [startPage.value, endPage.value])
  visible.value = false
}
</script>

<template>
  <el-dialog
    :title="title"
    v-model="visible"
    width="200px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="true"
    align-center
  >
    <div class="dialog-content">
      <div class="header">
        <div v-if="total" class="total-desc">{{ totalDesc }}</div>
        <div class="page-size-desc">{{ pageSizeDesc }}</div>
      </div>
      <el-row class="page-range">
        <el-col :span="11">
          <el-input type="number" v-model="startPage" :min="minPage" :max="endPage" />
        </el-col>
        <el-col :span="2" style="text-align: center">
          <span>-</span>
        </el-col>
        <el-col :span="11">
          <el-input type="number" v-model="endPage" :min="startPage" :max="maxPageNum" />
        </el-col>
      </el-row>
      <div class="range-desc">{{ rangeSizeDesc }}</div>
    </div>
    <template #footer>
      <el-button @click="handleCancel">{{ cancelText }}</el-button>
      <el-button type="primary" @click="handleSubmit">{{ confirmText }}</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.dialog-content {
  .header {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }

  .range-desc {
    margin-top: 10px;
  }
}
</style>
