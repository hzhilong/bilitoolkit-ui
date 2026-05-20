<script setup lang="ts" generic="D, Q">
import { usePageTable } from '@/composables/usePageTable'
import { computed, nextTick, onMounted, ref, useSlots, useTemplateRef, type Ref, type Slots } from 'vue'
import type { PageTableAction, PageTableProps } from './types'
import type { ElEmpty, ElTable } from 'element-plus'

const props = withDefaults(defineProps<PageTableProps<D, Q>>(), {
  autoLoad: true,
  actions: () => ['search', 'resetQuery'] as PageTableAction[],
})

// 使用组合式函数
const { pageData, tableData, loading, refresh, resetAndRefresh, handleSizeChange, handleCurrPageChange } = usePageTable<
  D,
  Q
>({
  fetchPage: props.fetchPage,
  pageParams: props.pageParams,
  queryParams: props.queryParams ? () => props.queryParams! : undefined,
  autoLoad: props.autoLoad,
  onLoaded: () => tableRef.value?.setScrollTop(0),
})

const emits = defineEmits<{
  reset: []
  search: []
}>()
// 搜索
const search = () => {
  emits('search')
  refresh()
}
// 重置
const reset = async () => {
  emits('reset')
  // 等待父组件完成参数重置
  await nextTick()
  await resetAndRefresh()
}

const tableWrapperRef = useTemplateRef<HTMLDivElement>('tableWrapperRef')
const tableRef = useTemplateRef<InstanceType<typeof ElTable>>('tableRef')
const _tableHeight = ref<number | string | undefined>(undefined)
// 自动调整表格高度
const adjustTableHeight = async () => {
  _tableHeight.value = props.tableHeight ?? tableWrapperRef.value?.clientHeight ?? 0
}

onMounted(async () => {
  if (!props.tableHeight) {
    // 父组件没有传表格高度时，这里自动调整高度为最大可用高度
    await nextTick()
    requestAnimationFrame(adjustTableHeight)
  }
})
// 按钮可见性
const actionVisible = computed(() => ({
  search: props.actions.includes('search'),
  resetQuery: props.actions.includes('resetQuery'),
}))

const paginationLayout = computed(() => {
  if (props.pageSizes && props.pageSizes.length > 1) {
    return 'total, sizes, prev, pager, next, jumper'
  }
  return 'total, prev, pager, next, jumper'
})

const slots: Slots = useSlots()
const hasQuerySlot = !!slots.query

defineExpose({
  loading,
  tableData: tableData as Ref<D[]>,
  pageData,
  refresh,
  resetAndRefresh,
  getSelectionRows: tableRef.value?.getSelectionRows,
  toggleRowSelection: tableRef.value?.toggleRowSelection,
  setCurrentRow: tableRef.value?.setCurrentRow,
  clearSelection: tableRef.value?.clearSelection,
  scrollTo: tableRef.value?.scrollTo,
})
</script>

<template>
  <div class="page-table" v-loading="loading">
    <div class="page-table__toolbar">
      <!-- 查询表单 -->
      <div class="page-table__query" :class="hasQuerySlot ? 'has-query' : ''">
        <slot name="query"></slot>
        <!-- 操作按钮 -->
        <div class="page-table__actions">
          <slot name="actions"></slot>
          <el-button v-if="actionVisible.search" type="primary" @click="search">搜索</el-button>
          <el-button v-if="actionVisible.resetQuery" @click="reset">重置</el-button>
        </div>
      </div>
    </div>

    <div ref="tableWrapperRef" class="page-table__table-wrapper">
      <el-table
        ref="tableRef"
        class="page-table__table"
        :data="tableData"
        style="width: 100%"
        border
        :height="_tableHeight"
        :highlight-current-row="selectionMode === 'single'"
      >
        <el-table-column v-if="selectionMode === 'multiple'" type="selection" width="55" />
        <slot></slot>
        <template #empty>
          <slot name="empty">
            <el-empty description="没有数据" />
          </slot>
        </template>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination
      class="page-table__pagination"
      v-model:current-page="pageData.pageNum"
      v-model:page-size="pageData.pageSize"
      :page-sizes="pageSizes"
      :layout="paginationLayout"
      :total="pageData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrPageChange"
    />
  </div>
</template>

<style scoped lang="scss">
.page-table {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;

  &__toolbar {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }

  &__query {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    transition: all 0.2s;

    ::v-deep(.el-form-item) {
      width: 180px;
      margin-bottom: 0;
    }

    ::v-deep(.el-form-item__label) {
      margin-bottom: 2px;
    }
  }
  &__actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    margin-left: auto;
  }
  &__table-wrapper {
    flex: 1;
    min-height: 0;
  }
  &__table {
    width: 100%;

    ::v-deep(.el-table__header .el-table__cell) {
      background-color: var(--el-fill-color);
    }
  }
  &__pagination {
    margin-left: auto;
    margin-top: 10px;
  }
}
</style>
