import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { testUser } from '@/test/user'
import { testMenus } from '@/test/menus'

/**
 * 测试数据状态 Store
 */
export const useTestDataStore = defineStore('biliToolkit-ui-test-data', () => {
  const state = reactive({
    isTest: false,
    user: testUser,
    menus: testMenus,
  })

  const init = async (isTest: boolean) => {
    state.isTest = isTest
  }

  return { init, state }
})
