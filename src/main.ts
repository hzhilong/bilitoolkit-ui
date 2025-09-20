import { type App } from 'vue'
// 集成 ElementPlus
import ElementPlus from 'element-plus'
import { ThemeUtils } from '@/utils/theme-utils.ts'

export const initBilitoolkitUi = async () => {
  // 导入自定义的css变量
  import('@/assets/scss/element/dark-var.css')
  import('@/assets/scss/element/light-var.css')
  import('element-plus/theme-chalk/dark/css-vars.css')
  // 集成 remixicon
  import('remixicon/fonts/remixicon.css')
  await ThemeUtils.initAppTheme()

  window.toolkitApi.event.onUpdateAppTheme((newState) => {
    ThemeUtils.updateAppTheme(newState)
  })

  return {
    install(app: App) {
      app.use(ElementPlus, { size: 'small', zIndex: 3000 })
    },
  }
}
