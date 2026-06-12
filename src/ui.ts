import { type App } from 'vue'
import type { Pinia } from 'pinia'
import { useAppThemeStore } from '@/stores/app-theme'
import 'element-plus/theme-chalk/dark/css-vars.css'
// 以服务的方式进行调用的组件，需要手动引入 css 样式
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import { useTestDataStore } from '@/stores/test-data'
import { useSelectedUserStore } from '@/stores/selected-user'

interface InitOptions {
  /** 是否使用测试数据 */
  useTestData?: boolean
  /** core 环境特有 */
  appThemeDBName?: string
  /** core 环境特有 */
  appThemeUpdateEvent?: string
}

/**
 * 初始化UI
 */
export const initBilitoolkitUi = async (pinia: Pinia, options?: InitOptions) => {
  const { useTestData = false } = options ?? {}
  import('@/assets/scss/element/light-var.css')
  import('@/assets/scss/element/dark-var.css')
  import('@/assets/scss/common/base.scss')

  if (useTestData) {
    await useTestDataStore(pinia).init(true)
  } else {
    await useAppThemeStore(pinia).init(options?.appThemeDBName, options?.appThemeUpdateEvent)
  }
  await useSelectedUserStore(pinia).init()

  return {
    install(_app: App) {},
  }
}
