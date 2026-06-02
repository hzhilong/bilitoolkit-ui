import type { PageRangeDialogProps } from '@/components/dialog/page-range/types'
import { createVNode, render } from 'vue'
import PageRangeDialog from '@/components/dialog/page-range/PageRangeDialog.vue'

export const showPageRangeDialog = (options: PageRangeDialogProps) => {
  return new Promise<[number, number] | undefined>((resolve) => {
    let container: HTMLDivElement | null = document.createElement('div')
    const close = (result?: [number, number]) => {
      if (container) {
        render(null, container)
        container.remove()
        container = null
      }
      resolve(result)
    }
    const instance = createVNode(PageRangeDialog, {
      ...options,
      modelValue: true,
      'onUpdate:modelValue'(visible: boolean) {
        if (!visible) close()
      },
      onConfirm(range: [number, number]) {
        close(range)
      },
    })
    document.body.appendChild(container)
    render(instance, container)
  })
}
