import { defineStore } from 'pinia'
import { watch, ref } from 'vue'
import cloneDeep from 'lodash-es/cloneDeep'
import { useTestDataStore } from '@/stores/test-data'
import type { UserInfoWithCookie } from '@ybgnb/bili-api'
import { UI_DB_KEYS } from '@/common/ui-constants'

/**
 * 选择的用户 状态 Store
 */
export const useSelectedUserStore = defineStore('biliToolkit-ui-selected-user', () => {
  const selectedUser = ref<UserInfoWithCookie | null>(null)

  const { state: testDataState } = useTestDataStore()

  // 初始化
  const init = async () => {
    try {
      if (testDataState.isTest) {
        selectedUser.value = testDataState.user
        return
      }
      selectedUser.value = await window.toolkitApi.db.init<UserInfoWithCookie>(UI_DB_KEYS.UI_SELECTED_USER)
    } catch (_: unknown) {}
  }

  watch(
    selectedUser,
    async (user) => {
      if (user && !testDataState.isTest) {
        await window.toolkitApi.db.write(UI_DB_KEYS.UI_SELECTED_USER, cloneDeep(user))
      }
    },
    { deep: true },
  )

  const deleteUser = () => {
    selectedUser.value = null
  }

  const setUser = (user: UserInfoWithCookie) => {
    selectedUser.value = user
  }

  return { init, user: selectedUser, deleteUser, setUser }
})
