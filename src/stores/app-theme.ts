import type { AppThemeState } from 'bilitoolkit-api-types'
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { defaultAppThemeState } from '@/common/ui-constants.ts'
import { ThemeUtils } from '@/utils/theme-utils.ts'
import { useTestDataStore } from '@/stores/test-data.ts'

/**
 * 应用主题状态 Store
 */
export const useAppThemeStore = defineStore('BiliToolkit-ui-AppThemeStore', () => {
  const state = reactive<AppThemeState>(defaultAppThemeState)

  const { state: testDataState } = useTestDataStore()

  // 初始化
  const init = async () => {
    if (!testDataState.isTest) {
      const newState = await window.toolkitApi.system.getAppThemeState()
      Object.assign(state, newState)
      await ThemeUtils.updateAppTheme(newState)
    } else {
      await ThemeUtils.updateAppTheme(state)
    }
  }

  // 监听
  window.toolkitApi.event.onUpdateAppTheme((newState) => {
    if (!testDataState.isTest) {
      Object.assign(state, newState)
      ThemeUtils.updateAppTheme(newState).then()
    }
  })

  return { init, state }
})
