import type { AppThemeState } from 'bilitoolkit-api-types'
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { defaultAppThemeState } from '@/common/ui-constants.ts'
import { ThemeUtils } from '@/utils/theme-utils.ts'

/**
 * 应用主题状态 Store
 */
export const useAppThemeStore = defineStore('BiliToolkit-AppThemeStore-ui', () => {
  const state = reactive<AppThemeState>(defaultAppThemeState)

  // 初始化
  const init = async () => {
    const newState = await window.toolkitApi.system.getAppThemeState()
    Object.assign(state, newState)
    await ThemeUtils.updateAppTheme(newState)
  }

  // 监听
  window.toolkitApi.event.onUpdateAppTheme((newState) => {
    Object.assign(state, newState)
    ThemeUtils.updateAppTheme(newState).then()
  })

  return { init, state }
})
