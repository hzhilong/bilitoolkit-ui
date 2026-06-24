import { createApp } from 'vue'
import LoadingDialog from '@/components/dialog/loading/LoadingDialog.vue'
import type { LoadingDialogOptions } from '@/components/dialog/loading/types'

type InstanceTypeEx = InstanceType<typeof LoadingDialog>
let instance: InstanceTypeEx | null = null

function ensureInstance() {
  if (instance) return instance

  const container = document.createElement('div')
  document.body.appendChild(container)

  const app = createApp(LoadingDialog)
  instance = app.mount(container) as InstanceTypeEx

  return instance
}

/**
 * 全局加载框
 */
export const loadingDialog = {
  show(options?: LoadingDialogOptions) {
    ensureInstance().show(options)
  },

  update(message: string) {
    ensureInstance().update(message)
  },

  close() {
    ensureInstance().close()
  },
}
