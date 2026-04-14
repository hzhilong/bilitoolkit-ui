import type { AppThemeMode, AppThemeState } from 'bilitoolkit-api-types'
import { toolkitApi } from '@/api/toolkit-api.ts'
import { useTestDataStore } from '@/stores/test-data.ts'
import { defaultAppThemeState } from '@/common/ui-constants.ts'

export const whiteColor = '#ffffff'
export const blackColor = '#000000'

export type AppThemeCssVars = Record<string, string>

/**
 * 设置 html 根元素的 css 变量
 * @param k
 * @param v
 */
export const setCssVar = (k: string, v: string) => {
  document.documentElement.style.setProperty(k, v)
}

/**
 * 生成 CSS `color-mix()` 函数的字符串表示，用于动态计算两种颜色的混合结果
 *
 * @param {string} color1 - 参与混合的第一种颜色（支持 CSS 合法颜色值，如 HEX、RGB、HSL 等）
 * @param {string} color2 - 参与混合的第二种颜色
 * @param {number} percentage - 主颜色（color1）在混合中的占比（百分比数值，范围 0-100）
 * @param {'srgb' | 'hsl'} [colorSpace='srgb'] - 色彩空间选项：
 *   - `'srgb'`: 标准 RGB 色彩空间（默认）
 *   - `'hsl'`: 色相-饱和度-明度色彩空间
 * @param {number} [percentage2] - 可选参数：副颜色（color2）的独立占比。
 *   若未提供，则自动计算为 `100 - percentage`
 * @returns {string} 可直接用于 CSS 的 `color-mix()` 函数字符串（如 `color-mix(in srgb, red 30%, blue 70%)`）
 *
 * @example
 * // 基础用法（自动计算互补占比）
 * mixColor('red', 'blue', 30)
 * // 返回: "color-mix(in srgb, red 30%, blue 70%)"
 *
 * @example
 * // 显式指定双占比 + HSL 色彩空间
 * mixColor('#ff0000', '#0000ff', 40, 'hsl', 60)
 * // 返回: "color-mix(in hsl, #ff0000 40%, #0000ff 60%)"
 */
export const mixColor = (
  color1: string,
  color2: string,
  percentage: number,
  colorSpace: 'srgb' | 'hsl' = 'srgb',
  percentage2?: number,
): string => {
  return `color-mix(in ${colorSpace}, ${color1} ${percentage}%, ${color2} ${percentage2 ? percentage2 : 100 - percentage}%)`
}

/**
 * 将十六进制颜色转换为 RGB
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

/**
 * 切换主题模式
 * @param dark  是否暗黑模式
 * @param vars  应用主题的css变量
 */
export const switchThemeMode = (dark: boolean, vars: AppThemeCssVars): AppThemeCssVars => {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  vars['--app-color-foreground'] = dark ? whiteColor : blackColor
  vars['--app-color-background'] = dark ? '#191919' : whiteColor
  return { foreground: vars['--app-color-foreground'], background: vars['--app-color-background'] }
}

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
  const { foreground, background } = switchThemeMode(isDark, vars)

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

  if (isDark) {
    vars['--el-bg-color'] = mixColor(primaryColor, background, 3)
    vars['--el-bg-color-page'] = mixColor(primaryColor, background, 4)
    vars['--el-bg-color-overlay'] = mixColor(primaryColor, background, 3)
  } else {
    vars['--el-bg-color'] = '#ffffff'
    vars['--el-bg-color-page'] = '#f2f3f5'
    vars['--el-bg-color-overlay'] = '#ffffff'
  }
  const { r, g, b } = hexToRgb(primaryColor)

  // 半透明遮罩，用于更高层级的背景覆盖。
  vars['--app-bg-color-overlay'] = `rgba(${r}, ${g}, ${b}, 0.05)`
  vars['--app-bg-color-overlay-hover'] = `rgba(${r}, ${g}, ${b}, 0.15)`
  // 主页面遮罩
  vars['--app-bg-color-page'] = isDark ? `rgba(${r}, ${g}, ${b}, 0.05)` : 'transparent'

  vars['--el-border-color'] = mixColor(primaryColor, background, 30)
  vars['--el-border-color-light'] = mixColor(primaryColor, background, 25)
  vars['--el-border-color-lighter'] = mixColor(primaryColor, background, 20)
  vars['--el-border-color-extra-light'] = mixColor(primaryColor, background, 10)
  vars['--el-border-color-dark'] = mixColor(primaryColor, foreground, 60)
  vars['--el-border-color-darker'] = mixColor(primaryColor, foreground, 50)
  vars['--el-border-color-hover'] = mixColor(primaryColor, foreground, 40)

  // vars['--el-fill-color'] = `rgba(0,0,0, 0.05)`
  vars['--el-fill-color-light'] = `rgba(${r}, ${g}, ${b}, 0.1)`
  vars['--el-fill-color-lighter'] = `rgba(${r}, ${g}, ${b}, 0.15)`
  vars['--el-fill-color-extra-light'] = `rgba(${r}, ${g}, ${b}, 0.2)`
  // vars['--el-fill-color-dark'] = `rgba(255,255,255, 0.93)`
  // vars['--el-fill-color-darker'] = `rgba(255, 255, 255, 0.91)`
  // vars['--el-fill-color-blank'] = `rgba(255,255,255, 1)`

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
  if (!useTestDataStore().state.isTest) {
    // 非测试模式
    const state = appThemeState ?? (await toolkitApi.system.getAppThemeState())
    const dark = await isDarkTheme(state.themeMode)
    baseUpdateThemeColor(state.primaryColor, state.themeMode, dark)
  } else {
    const state = appThemeState ?? defaultAppThemeState
    baseUpdateThemeColor(state.primaryColor, state.themeMode, false)
  }
}

/**
 * 初始化应用主题
 */
export const initAppTheme = async () => {
  await updateAppTheme(await toolkitApi.system.getAppThemeState())
}
