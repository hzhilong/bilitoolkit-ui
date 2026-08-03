import { ref, type Ref } from 'vue'
import type { UserInfoWithCookie } from '@ybgnb/bili-api'
import { useSelectedUserStore } from '@/stores/selected-user'
import { loadingDialog } from '@/components/dialog/loading/service'

export interface UseLoadingTaskOptions {
  loading?: Ref<boolean>
  initMsg?: string
  disableCancel?: boolean
}

export interface LoadingTaskContext {
  user: UserInfoWithCookie
  signal: AbortSignal
}

/**
 * 封装异步任务执行，自动管理加载状态
 */
export const useLoadingTask = <TArgs extends any[] = [], TReturn = void>(
  task: (context: LoadingTaskContext, ...args: TArgs) => TReturn | Promise<TReturn>,
  options?: UseLoadingTaskOptions,
) => {
  const loading = options?.loading ?? ref(false)
  const isAborted = ref(false)
  const selectedUserStore = useSelectedUserStore()
  const execTask = async (...args: TArgs): Promise<TReturn> => {
    try {
      loading.value = true
      selectedUserStore.assertLoggedIn()
      const abortController = new AbortController()
      loadingDialog.show({
        message: options?.initMsg ?? '加载中',
        showCancel: !options?.disableCancel,
        onCancel: () => abortController.abort(),
      })
      return await task(
        {
          signal: abortController.signal,
          user: selectedUserStore.user!,
        },
        ...args,
      )
    } finally {
      loadingDialog.close()
      loading.value = false
    }
  }
  return {
    loading,
    execTask,
    isAborted,
  }
}
