import { ref } from 'vue'

export const useLoadingData = () => {
  const loading = ref(false)

  /**
   * 包装函数或 Promise，使其执行时自动管理 loading 状态
   * 支持同步函数、异步函数、直接 Promise，支持参数传入
   */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadingData = <TArgs extends any[] = [], TReturn = void>(
    doneFn: ((...args: TArgs) => TReturn | Promise<TReturn>) | Promise<TReturn>
  ): ((...args: TArgs) => Promise<TReturn>) => {
    return async (...args: TArgs): Promise<TReturn> => {
      loading.value = true
      try {
        if (typeof doneFn === 'function') {
          return await doneFn(...args)
        } else {
          return await doneFn
        }
      } finally {
        loading.value = false
      }
    }
  }

  return {
    loading,
    loadingData,
  }
}
