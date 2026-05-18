import { type App } from 'vue'
// 集成 ElementPlus
import type { Pinia } from 'pinia'
import { useAppThemeStore } from '@/stores/app-theme'
import 'element-plus/theme-chalk/dark/css-vars.css'
// 以服务的方式进行调用的组件，需要手动引入 css 样式
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import { useTestDataStore } from '@/stores/test-data'
import { useSelectedUserStore } from '@/stores/selected-user'
// import '@/assets/scss/element/light-var.css'
// import '@/assets/scss/element/dark-var.css'
// import '@/assets/scss/common/base.scss'

/**
 * 初始化UI
 * @param pinia
 * @param isTestMode 测试模式，不使用工具姬的API。方便插件直接本地调试。
 */
export const initBilitoolkitUi = async (pinia: Pinia, isTestMode: boolean = false) => {
  import('@/assets/scss/element/light-var.css')
  import('@/assets/scss/element/dark-var.css')
  import('@/assets/scss/common/base.scss')

  if (isTestMode) {
    await useTestDataStore(pinia).init(true)
  } else {
    await useAppThemeStore(pinia).init()
  }
  await useSelectedUserStore(pinia).init()

  return {
    install(_app: App) {},
  }
}
