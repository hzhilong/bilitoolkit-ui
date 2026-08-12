import { createVNode, render } from 'vue'
import VirtualSelectDialog from './VirtualSelectDialog.vue'
import type { VirtualSelectDialogProps } from '@/components/dialog/select/types'

export const showVirtualSelectDialog = <DATA = unknown, ID_KEY extends keyof DATA = keyof DATA>(
  options: VirtualSelectDialogProps<DATA, ID_KEY>,
) => {
  return new Promise<DATA[] | undefined>((resolve) => {
    let container: HTMLDivElement | null = document.createElement('div')
    const close = (result?: DATA[]) => {
      resolve(result)
      if (container) {
        render(null, container)
        container.remove()
        container = null
      }
    }
    const instance = createVNode(VirtualSelectDialog, {
      ...options,
      modelValue: true,
      'onUpdate:modelValue': (visible: boolean) => {
        if (!visible) close()
      },
      onConfirm: (list: DATA[]) => {
        close(list)
      },
    })
    document.body.appendChild(container)
    render(instance, container)
  })
}
