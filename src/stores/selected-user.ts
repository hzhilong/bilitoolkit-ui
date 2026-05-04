import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import cloneDeep from 'lodash-es/cloneDeep'
import { useTestDataStore } from '@/stores/test-data'
import type { UserInfo } from '@ybgnb/bili-api'
import { UI_DB_KEYS } from '@/common/ui-constants'

/**
 * 选择的用户 状态 Store
 */
export const useSelectedUserStore = defineStore('BiliToolkit-ui-SelectedUserStore', () => {
  const state = reactive<{
    selectedUser: UserInfo | null
  }>({
    selectedUser: null,
  })

  const { state: testDataState } = useTestDataStore()

  // 初始化
  const init = async () => {
    try {
      if (testDataState.isTest) {
        state.selectedUser = testDataState.user
        return
      }
      state.selectedUser = await window.toolkitApi.db.init<UserInfo>(UI_DB_KEYS.UI_SELECTED_USER)
    } catch (_: unknown) {}
  }

  watch(
    state,
    async (newState) => {
      if (newState.selectedUser && !testDataState.isTest) {
        await window.toolkitApi.db.write(UI_DB_KEYS.UI_SELECTED_USER, cloneDeep(newState.selectedUser!))
      }
    },
    { deep: true },
  )

  const deleteUser = () => {
    state.selectedUser = null
  }

  const setUser = (user: UserInfo) => {
    state.selectedUser = user
  }

  return { init, state, deleteUser, setUser }
})
