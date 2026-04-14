import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import cloneDeep from 'lodash-es/cloneDeep'
import { useTestDataStore } from '@/stores/test-data.ts'
import type { UserInfo } from '@ybgnb/bili-api'

/**
 * 选择的用户 状态 Store
 */
export const useSelectedUserStore = defineStore('BiliToolkit-ui-SelectedUserStore', () => {
  const state = reactive<{
    selectedUser: UserInfo | undefined
  }>({
    selectedUser: undefined,
  })

  const { state: testDataState } = useTestDataStore()

  // 初始化
  const init = async () => {
    try {
      if (testDataState.isTest) {
        state.selectedUser = testDataState.user
        return
      }
      const newState = await window.toolkitApi.db.read<UserInfo>('ui-selected-user')
      if (newState) {
        state.selectedUser = newState
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_: unknown) {}
  }

  watch(
    state,
    async (newState) => {
      if (newState.selectedUser && !testDataState.isTest) {
        await window.toolkitApi.db.write('ui-selected-user', cloneDeep(newState.selectedUser!))
      }
    },
    { deep: true },
  )

  const deleteUser = () => {
    state.selectedUser = undefined
  }

  const setUser = (user: UserInfo) => {
    state.selectedUser = user
  }

  return { init, state, deleteUser, setUser }
})
