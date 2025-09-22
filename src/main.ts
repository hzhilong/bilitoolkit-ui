import { createApp } from 'vue'
import { AppUtils, logger } from 'bilitoolkit-ui'
import HomeView from '@/views/HomeView.vue'
import ElementPlus from 'element-plus'
// 导入自定义的css变量
import '@/assets/scss/element/dark-var.css'
import '@/assets/scss/element/light-var.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// 以服务的方式进行调用的组件，需要手动引入 css 样式
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
// 集成 remixicon
import 'remixicon/fonts/remixicon.css'

async function bootstrapApp() {
  const app = createApp(HomeView)

  // 挂载到全局属性
  app.config.globalProperties.$toolkitApi = window.toolkitApi

  app.use(ElementPlus, { size: 'small', zIndex: 3000 })
  app.mount('#app')
}

bootstrapApp()
  .then(() => {
    logger.info('ui 测试app 启动成功')
  })
  .catch(AppUtils.handleError)
