import { createApp } from 'vue'
import type { ProcessDialogOptions } from '@/components/dialog/process/types'
import ProcessDialog from '@/components/dialog/process/ProcessDialog.vue'

type InstanceTypeEx = InstanceType<typeof ProcessDialog>
let instance: InstanceTypeEx | null = null

function ensureInstance() {
  if (instance) return instance

  const container = document.createElement('div')
  document.body.appendChild(container)

  const app = createApp(ProcessDialog)
  instance = app.mount(container) as InstanceTypeEx

  return instance
}

/**
 * 任务进度弹窗
 */
export const processDialog = {
  show(options?: ProcessDialogOptions) {
    ensureInstance().show(options)
  },

  update(currPct?: number, text?: string) {
    ensureInstance().update(currPct, text)
  },

  success(message?: string) {
    ensureInstance().setSuccess(message)
  },

  error(message?: string) {
    ensureInstance().setError(message)
  },

  close() {
    ensureInstance().close()
  },
}
