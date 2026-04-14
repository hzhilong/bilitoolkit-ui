import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { testUser } from '@/test/user.ts'
import { testMenus } from '@/test/menus.ts'

/**
 * 测试数据状态 Store
 */
export const useTestDataStore = defineStore('BiliToolkit-ui-TestDataStore', () => {
  const state = reactive({
    isTest: false,
    user: testUser,
    menus: testMenus,
  })

  // 初始化
  const init = async (isTest: boolean) => {
    state.isTest = isTest
  }

  return { init, state }
})
