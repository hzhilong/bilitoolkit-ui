import { ref, type Ref } from 'vue'

interface UseLoadingDataOptions {
  loading?: Ref<boolean>
  /** 是否限制同一时刻只能有一次加载 */
  singleFlight?: boolean
}

/**
 * 封装的数据加载函数，方便关联返回的 loading
 */
export const useLoadingData = (options?: UseLoadingDataOptions) => {
  const loading = options?.loading ?? ref(false)
  // 缓存正在进行的 Promise
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pendingPromise: Promise<any> | null = null
  // 已经执行过至少一次加载
  const hasLoaded = ref(false)

  /**
   * 包装函数或 Promise，使其执行时自动管理 loading 状态
   * 支持同步函数、异步函数、直接 Promise，支持参数传入
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadingData = <TArgs extends any[] = [], TReturn = void>(
    doneFn: ((...args: TArgs) => TReturn | Promise<TReturn>) | Promise<TReturn>,
  ): ((...args: TArgs) => Promise<TReturn>) => {
    return async (...args: TArgs): Promise<TReturn> => {
      // 开启 singleFlight 且已有正在进行的请求
      if (options?.singleFlight && loading.value && pendingPromise) {
        // 直接返回之前的 Promise
        return pendingPromise
      }

      const exec = async () => {
        loading.value = true
        try {
          if (typeof doneFn === 'function') {
            return await doneFn(...args)
          } else {
            return await doneFn
          }
        } finally {
          loading.value = false
          hasLoaded.value = true
          pendingPromise = null // 清空缓存
        }
      }

      pendingPromise = exec()
      return pendingPromise
    }
  }

  return {
    loading,
    hasLoaded,
    loadingData,
  }
}
