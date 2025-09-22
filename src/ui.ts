import { type App } from 'vue'
// 集成 ElementPlus
import ElementPlus from 'element-plus'
import { ThemeUtils } from '@/utils/theme-utils.ts'

export const initBilitoolkitUi = async () => {
  // 导入自定义的css变量
  await import('@/assets/scss/element/dark-var.css')
  await import('@/assets/scss/element/light-var.css')
  await import('element-plus/theme-chalk/dark/css-vars.css')
  // 以服务的方式进行调用的组件，需要手动引入 css 样式
  await import('element-plus/theme-chalk/el-loading.css')
  await import('element-plus/theme-chalk/el-message.css')
  await import('element-plus/theme-chalk/el-message-box.css')
  // 集成 remixicon
  import('remixicon/fonts/remixicon.css')
  import('@/assets/scss/common/base.scss')
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
