import { createVNode, render } from 'vue'
import SelectDialog from './SelectDialog.vue'
import type { SelectDialogProps } from '@/components/dialog/select/types'

export const showSelectDialog = <T>(options: SelectDialogProps<T>) => {
  return new Promise<T[] | undefined>((resolve) => {
    let container: HTMLDivElement | null = document.createElement('div')
    const close = (result?: T[]) => {
      resolve(result)
      if (container) {
        render(null, container)
        container.remove()
        container = null
      }
    }
    const instance = createVNode(SelectDialog, {
      ...options,
      modelValue: true,
      'onUpdate:modelValue': (visible: boolean) => {
        if (!visible) close()
      },
      onConfirm: (list: T[]) => {
        close(list)
      },
    })
    document.body.appendChild(container)
    render(instance, container)
  })
}
