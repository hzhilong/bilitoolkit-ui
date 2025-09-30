import { type App } from 'vue'
// 集成 ElementPlus
import ElementPlus from 'element-plus'
import type { Pinia } from 'pinia'
import { useAppThemeStore } from '@/stores/app-theme.ts'
// 以服务的方式进行调用的组件，需要手动引入 css 样式
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { useSelectedAccountStore } from '@/stores/selected-account.ts'
// import '@/assets/scss/element/light-var.css'
// import '@/assets/scss/element/dark-var.css'
// import '@/assets/scss/common/base.scss'

export const initBilitoolkitUi = async (pinia: Pinia) => {
  import('@/assets/scss/element/light-var.css')
  import('@/assets/scss/element/dark-var.css')
  import('@/assets/scss/common/base.scss')
  await useAppThemeStore(pinia).init()
  await useSelectedAccountStore(pinia).init()

  return {
    install(app: App) {
      app.use(ElementPlus, { size: 'small', zIndex: 3000 })
    },
  }
}
