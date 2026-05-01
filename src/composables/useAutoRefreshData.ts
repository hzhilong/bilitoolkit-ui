import { onMounted, onUnmounted } from 'vue'
import { useLoadingData } from '@/composables/useLoadingData.ts'

export const useAutoRefreshData = (
  doneFn: Promise<void> | (() => void | Promise<void>),
  intervalTimeMs: number = 3000,
) => {
  const { loading, loadingData } = useLoadingData(true)
  const refreshTableData = loadingData(doneFn)
  let timer: null | ReturnType<typeof setInterval> = null

  onMounted(async () => {
    timer = setInterval(refreshTableData, intervalTimeMs)
  })

  onUnmounted(() => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  })

  const reset = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    refreshTableData()
    timer = setInterval(refreshTableData, intervalTimeMs)
  }

  return { loading, refreshTableData, reset }
}
