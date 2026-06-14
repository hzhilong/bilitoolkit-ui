import { toolkitApi } from '@/api/toolkit-api'
import { defaultAppThemeState } from '@/common/ui-constants'
import { useAppThemeStore } from '@/stores/app-theme'
import { hexToRgb, mixColor, setCssVar } from '@ybgnb/utils/dom'
import type { AppThemeMode, AppThemeState } from 'bilitoolkit-types'

export const whiteColor = '#ffffff'
export const blackColor = '#000000'

export type AppThemeCssVars = Record<string, string>

/**
 * 初始化透明颜色变量集合
 * @param primaryColor  主题色
 * @param vars          目标保存对象
 * @param preKey        透明色前缀
 */
export const initTransparentColors = (primaryColor: string, vars: AppThemeCssVars, preKey: string) => {
  const { r, g, b } = hexToRgb(primaryColor)
  for (let i = 2; i < 100; ) {
    const opacity = i / 100
    vars[`${preKey}-transparent-${i}`] = `rgba(${r}, ${g}, ${b}, ${opacity})`
    if (i >= 10) {
      i += 5
    } else {
      i++
    }
  }
}

/**
 * 更新主题色的基本方法
 */
export const baseUpdateThemeColor = (primaryColor: string, themeMode: AppThemeMode, isDark: boolean) => {
  const vars: AppThemeCssVars = {}
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  const foreground = (vars['--app-color-foreground'] = isDark ? whiteColor : blackColor)
  const background = (vars['--app-color-background'] = isDark ? blackColor : whiteColor)

  vars['--app-primary-color'] = primaryColor
  vars['--el-color-primary'] = primaryColor
  vars['--el-color-primary-light-1'] = mixColor(primaryColor, background, 90)
  vars['--el-color-primary-light-2'] = mixColor(primaryColor, background, 80)
  vars['--el-color-primary-light-3'] = mixColor(primaryColor, background, 70)
  vars['--el-color-primary-light-4'] = mixColor(primaryColor, background, 60)
  vars['--el-color-primary-light-5'] = mixColor(primaryColor, background, 50)
  vars['--el-color-primary-light-6'] = mixColor(primaryColor, background, 40)
  vars['--el-color-primary-light-7'] = mixColor(primaryColor, background, 30)
  vars['--el-color-primary-light-8'] = mixColor(primaryColor, background, 20)
  vars['--el-color-primary-light-9'] = mixColor(primaryColor, background, 12)

  vars['--el-color-primary-dark-1'] = mixColor(primaryColor, foreground, 90)
  vars['--el-color-primary-dark-2'] = mixColor(primaryColor, foreground, 80)
  vars['--el-color-primary-dark-3'] = mixColor(primaryColor, foreground, 70)
  vars['--el-color-primary-dark-4'] = mixColor(primaryColor, foreground, 60)
  vars['--el-color-primary-dark-5'] = mixColor(primaryColor, foreground, 50)
  vars['--el-color-primary-dark-6'] = mixColor(primaryColor, foreground, 40)
  vars['--el-color-primary-dark-7'] = mixColor(primaryColor, foreground, 30)
  vars['--el-color-primary-dark-8'] = mixColor(primaryColor, foreground, 20)
  vars['--el-color-primary-dark-9'] = mixColor(primaryColor, foreground, 12)

  const { r, g, b } = hexToRgb(primaryColor)

  // 半透明遮罩，用于更高层级的背景覆盖。
  vars['--app-bg-color-overlay'] = `rgba(${r}, ${g}, ${b}, 0.05)`
  vars['--app-bg-color-overlay-hover'] = `rgba(${r}, ${g}, ${b}, 0.15)`
  // 主页面背景
  //  vars['--app-bg-color-page'] = isDark ? mixColor(primaryColor, mixColor(background, foreground, 96), 5) : 'transparent'
  vars['--app-bg-color-page'] = isDark ? 'var(--el-fill-color-blank)' : 'transparent'
  vars['--app-bg-color-menus'] = `var(--app-bg-color-page)`

  if (isDark) {
    // vars['--el-bg-color'] = mixColor(primaryColor, mixColor(background, foreground, 96), 5)
    // vars['--el-bg-color-page'] = mixColor(primaryColor, mixColor(background, foreground, 96), 4)
    // vars['--el-bg-color-overlay'] = mixColor(primaryColor, mixColor(background, foreground, 96), 3)
    vars['--app-text-shadow'] = ` 0px 1px 2px rgba(255, 255, 255, .4)`
  } else {
    // vars['--el-bg-color'] = '#ffffff'
    // vars['--el-bg-color-page'] = '#fafafa'
    // vars['--el-bg-color-overlay'] = '#ffffff'
    vars['--app-text-shadow'] = ` 0px 1px 2px rgba(0, 0, 0, .4)`
  }

  // vars['--el-fill-color-extra-light'] = mixColor(background, foreground, 95)
  // vars['--el-fill-color-lighter'] = mixColor(background, foreground, 95)
  // vars['--el-fill-color-light'] = mixColor(background, foreground, 95)
  // vars['--el-fill-color'] = mixColor(background, foreground, 95)
  // vars['--el-fill-color-dark'] = mixColor(background, foreground, 95)
  // vars['--el-fill-color-darker'] = mixColor(background, foreground, 95)
  // vars['--el-fill-color-blank'] = `var(--app-bg-color-page)`

  // vars['--el-border-color'] = mixColor(primaryColor, background, isDark ? 30 : 30)
  // vars['--el-border-color-light'] = mixColor(primaryColor, background, isDark ? 25 : 25)
  // vars['--el-border-color-lighter'] = mixColor(primaryColor, background, isDark ? 20 : 20)
  // vars['--el-border-color-extra-light'] = mixColor(primaryColor, background, isDark ? 10 : 10)
  // vars['--el-border-color-dark'] = mixColor(primaryColor, foreground, isDark ? 70 : 60)
  // vars['--el-border-color-darker'] = mixColor(primaryColor, foreground, isDark ? 60 : 50)
  // vars['--el-border-color-hover'] = mixColor(primaryColor, foreground, isDark ? 50 : 40)

  initTransparentColors(primaryColor, vars, '--app-color-primary')
  initTransparentColors(background, vars, '--app-color-background')
  initTransparentColors(foreground, vars, '--app-color-foreground')

  for (const key in vars) {
    setCssVar(key, vars[key])
  }
}

/**
 * 是否为暗黑模式主题
 * @param themeMode
 */
export const isDarkTheme = async (themeMode?: AppThemeMode) => {
  const newMode = themeMode ?? (await toolkitApi.system.getAppThemeState()).themeMode
  if (newMode === 'system') {
    return await toolkitApi.system.shouldUseDarkColors()
  } else {
    return newMode === 'dark'
  }
}

/**
 * 更新应用主题
 */
export const updateAppTheme = async (appThemeState?: AppThemeState) => {
  const state = appThemeState ?? (await toolkitApi.system.getAppThemeState())
  const dark = await isDarkTheme(state.themeMode)
  baseUpdateThemeColor(state.primaryColor, state.themeMode, dark)
}

/**
 * 初始化应用主题
 */
export const initAppTheme = async () => {
  await updateAppTheme(undefined)
}

/**
 * 切换为默认主题
 */
export const switchDefaultTheme = async () => {
  await updateAppTheme(defaultAppThemeState)
}

export const switchThemeMode = async (themeMode: AppThemeMode) => {
  const themeStore = useAppThemeStore()
  const state = themeStore.state
  const dark = await isDarkTheme(themeMode)
  state.dark = dark
  state.themeMode = themeMode
  baseUpdateThemeColor(state.primaryColor, themeMode, dark)
}

export const updatePrimaryColor = async (primaryColor: string) => {
  const themeStore = useAppThemeStore()
  const state = themeStore.state
  const dark = await isDarkTheme(state.themeMode)
  state.primaryColor = primaryColor
  baseUpdateThemeColor(primaryColor, state.themeMode, dark)
}
