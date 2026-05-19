import type { PageData, GetPage, ResetPageParams, PageParams, Data } from '@/core/types/page'
import { ref, watch, type MaybeRefOrGetter, toValue } from 'vue'
import { useLoadingData } from 'bilitoolkit-ui'

export const useTable = <D extends Data>(
  refreshTableSource: MaybeRefOrGetter,
  getPage: GetPage<D>,
  resetParams: MaybeRefOrGetter<ResetPageParams<D>>,
) => {
  const defaultPageData: PageData = {
    pageNum: 1,
    pageSize: 20,
    totalPages: 0,
    total: 0,
  }

  const pageData = ref<PageData>(defaultPageData)
  const tableData = ref<D[]>([])
  const { loading, loadingData } = useLoadingData()

  // 刷新表格数据（不重置分页条件）
  const refreshTableData = loadingData(async () => {
    const resetParamsData = toValue(resetParams)
    const pageParams = {
      pageNum: pageData.value.pageNum,
      pageSize: pageData.value.pageSize,
      ...resetParamsData,
    } as PageParams<D>
    const { data, ...page } = await getPage(pageParams)
    tableData.value = data
    pageData.value = page
  })

  const resetPageData = () => {
    const { pageSize: _, ...rest } = defaultPageData
    Object.assign(pageData.value, rest)
  }

  // 刷新表格（重置分页条件）
  const refreshTable = () => {
    tableData.value = []
    resetPageData()
    refreshTableData()
  }

  watch(
    refreshTableSource,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        refreshTable()
      }
    },
    { immediate: true },
  )
  const handleSizeChange = () => {
    pageData.value.pageNum = 1
    refreshTableData()
  }
  const handleCurrPageChange = () => {
    refreshTableData()
  }

  return {
    pageData,
    tableData,
    loading,
    refreshTableData,
    refreshTable,
    handleSizeChange,
    handleCurrPageChange,
  }
}
