import { defineStore } from 'pinia'
import { watch, ref, type Ref } from 'vue'
import cloneDeep from 'lodash-es/cloneDeep'
import type { UserInfoWithCookie } from '@ybgnb/bili-api'
import { UI_DB_KEYS } from '@/common/ui-constants'

/**
 * 选择的用户 状态 Store
 */
export const useSelectedUserStore = defineStore('biliToolkit-ui-selected-user', () => {
  const selectedUser: Ref<UserInfoWithCookie | null> = ref(null)

  // 初始化
  const init = async () => {
    try {
      selectedUser.value =
        (
          await window.toolkitApi.db.init<{
            user: UserInfoWithCookie | null
          }>(UI_DB_KEYS.UI_SELECTED_USER)
        )?.user ?? null
    } catch (_: unknown) {}
  }

  watch(
    () => selectedUser.value,
    async (user) => {
      let clonedUser = user != null ? cloneDeep(user) : null
      await window.toolkitApi.db.write(UI_DB_KEYS.UI_SELECTED_USER, {
        user: clonedUser,
      })
      if (clonedUser) {
        await window.toolkitApi.user.switchCurrUser(clonedUser)
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

  const assertLoggedIn = () => {
    if (selectedUser.value == null) {
      throw new Error('请先登录')
    }
  }

  return { init, user: selectedUser, deleteUser, setUser, assertLoggedIn }
})
