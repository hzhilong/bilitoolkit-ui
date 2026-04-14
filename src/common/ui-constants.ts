import type { AppThemeState } from 'bilitoolkit-api-types'

/**
 * 应用主题状态配置源
 */
export const APP_THEME_STATE = {
  // 默认备选的主题色
  primaryColors: ['#6284DF', '#474747', '#B04040', '#F7A456', '#D39C1F', '#079307', '#21AB86', '#00AEEC', '#FB7299'],
  // 默认的主题色下标
  primaryColorIndex: 0,
} as const

/**
 * 默认的应用主题状态
 */
export const defaultAppThemeState: Readonly<AppThemeState> = {
  primaryColorIndex: APP_THEME_STATE.primaryColorIndex,
  primaryColor: APP_THEME_STATE.primaryColors[APP_THEME_STATE.primaryColorIndex],
  themeMode: 'light',
  bgMode: 'default',
  dark: false,
}
