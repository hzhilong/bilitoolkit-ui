import type { AppThemeState } from 'bilitoolkit-types'
import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import { defaultAppThemeState, APP_THEME_STATE } from '@/common/ui-constants'
import { updateAppTheme } from '@/utils/theme'
import cloneDeep from 'lodash-es/cloneDeep'

/**
 * 应用主题状态 Store
 */
export const useAppThemeStore = defineStore(
  'biliToolkit-ui-theme',
  () => {
    const state = reactive<AppThemeState>(defaultAppThemeState)

    let isCore = false

    // 初始化
    const init = async (dbName?: string, updateEvent?: string) => {
      const newState = await window.toolkitApi.system.getAppThemeState()
      Object.assign(state, newState)
      await updateAppTheme(newState)

      if (dbName && updateEvent) {
        isCore = true
        // 设置变化后更新数据库
        watch(
          () => state,
          (newVal) => {
            // 写入配置
            const data = cloneDeep(newVal)
            window.toolkitApi.db.write(dbName, data).then(async () => {
              await window.toolkitApi.event.emit(updateEvent, data)
            })
          },
          { deep: true },
        )
      }
    }

    // 监听变化
    window.toolkitApi.event
      .onUpdateAppTheme((newState) => {
        // 插件环境，主题数据由其他地方更新，这里也要更新
        if (!isCore) Object.assign(state, newState)
        updateAppTheme(newState).then()
      })
      .catch()

    /**
     * 设置主题色
     * @param color
     */
    const setPrimaryColor = (color: string) => {
      state.primaryColor = color
      return state.primaryColor
    }

    /**
     * 切换主题颜色
     */
    const switchThemeColor = () => {
      state.primaryColorIndex = (state.primaryColorIndex + 1) % APP_THEME_STATE.primaryColors.length
      const newColor = APP_THEME_STATE.primaryColors[state.primaryColorIndex]
      return setPrimaryColor(newColor)
    }

    return { init, state, switchThemeColor, setPrimaryColor }
  },
  {
    // 自己实现配置的持久化
    persist: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
)
