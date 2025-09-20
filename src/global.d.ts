
// 对vue进行类型补充说明
import type { ToolkitApi } from 'bilitoolkit-api-types'

declare module '@vue/runtime-core' {
  // interface ComponentCustomOptions {}

  interface ComponentCustomProperties {
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 全局类型
declare global {
  export interface Window {
    toolkitApi: ToolkitApi
  }
}

export {}
