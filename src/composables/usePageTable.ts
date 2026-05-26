import { ref, type MaybeRefOrGetter, toValue, onMounted, computed } from 'vue'
import { useLoadingData } from '@/composables/useLoadingData'
import type { FetchPage, PageData, PageParams } from '@/types/page'

export interface UsePageTableOptions<D, Q = undefined> {
  /** 获取分页数据的方法 */
  fetchPage: FetchPage<D, Q>
  /** 分页参数 */
  pageParams?: MaybeRefOrGetter<PageParams | undefined>
  /** 查询参数 */
  queryParams?: MaybeRefOrGetter<Q>
  /** 是否自动加载数据 */
  autoLoad?: boolean
  /** 数据加载完成后的回调 */
  onLoaded?: () => void | Promise<void>
}

export const usePageTable = <D, Q = undefined>(options: UsePageTableOptions<D, Q>) => {
  const { fetchPage, pageParams, queryParams, autoLoad, onLoaded } = options

  const defaultPageData = computed(() => {
    const pageParamsData = toValue(pageParams)
    return {
      pageNum: pageParamsData?.pageNum ?? 1,
      pageSize: pageParamsData?.pageSize ?? 20,
      totalPages: 0,
      total: 0,
    } satisfies PageData
  })

  const pageData = ref<PageData>(defaultPageData.value)
  const tableData = ref<D[]>([])
  const { loading, loadingData } = useLoadingData()

  // 刷新表格数据（不重置分页条件）
  const refresh = loadingData(async () => {
    const queryParamsData = toValue(queryParams)
    const currPageParams: PageParams = {
      pageNum: pageData.value.pageNum,
      pageSize: pageData.value.pageSize,
    }
    console.log(`refresh`, currPageParams, queryParamsData)
    const { data, ...page } = queryParamsData
      ? await fetchPage(currPageParams, queryParamsData)
      : await (fetchPage as FetchPage<D>)(currPageParams)
    tableData.value = data
    pageData.value = page
    onLoaded?.()
  })

  const resetPageData = () => {
    const { pageSize: _, ...rest } = defaultPageData.value
    Object.assign(pageData.value, rest)
  }

  const resetQueryParams = () => {}

  // 刷新表格（重置分页条件）
  const resetAndRefresh = async () => {
    resetPageData()
    resetQueryParams()
    await refresh()
  }

  const handleSizeChange = async () => {
    pageData.value.pageNum = 1
    await refresh()
  }

  const handleCurrPageChange = async () => {
    await refresh()
  }

  if (autoLoad) {
    onMounted(async () => {
      await resetAndRefresh()
    })
  }

  return {
    pageData,
    tableData,
    loading,
    refresh,
    resetAndRefresh,
    handleSizeChange,
    handleCurrPageChange,
  }
}
