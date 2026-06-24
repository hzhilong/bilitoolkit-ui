import { createApp } from 'vue'
import { createPinia } from 'pinia'
import HomeView from '@/views/HomeView.vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'
// 以服务的方式进行调用的组件，需要手动引入 css 样式
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
// 导入自定义的css变量
import '@/assets/scss/element/light-var.css'
import '@/assets/scss/element/dark-var.css'
import '@/assets/scss/common/base.scss'
import { handleError } from '@/utils/feedback'
import 'remixicon/fonts/remixicon.css'

async function bootstrapApp() {
  const app = createApp(HomeView)

  // 挂载到全局属性
  app.config.globalProperties.$toolkitApi = window.toolkitApi
  const pinia = createPinia()
  app.use(pinia)
  //  await useAppThemeStore(pinia).init()
  app.mount('#app')
}

bootstrapApp()
  .then(() => {
    console.log('ui 测试app 启动成功')
  })
  .catch(handleError)
