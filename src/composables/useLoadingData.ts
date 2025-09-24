import { ref } from 'vue'

export const useLoadingData = () => {
  const loading = ref(false)
  const loadingData = async <T=void>(doneFn: (() => T | Promise<T>) | Promise<T>): Promise<T> => {
    loading.value = true
    try {
      // 统一转换成 Promise
      return typeof doneFn === 'function' ? await doneFn() : await doneFn
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    loadingData,
  }
}
