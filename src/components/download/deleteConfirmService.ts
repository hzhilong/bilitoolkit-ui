import { createApp, h, ref } from 'vue'
import { createAbortError } from '@ybgnb/utils'
import DeleteConfirmDialog from '@/components/download/DeleteConfirmDialog.vue'

export interface DeleteConfirmDialogOptions {
  title?: string
  message: string
  confirmButtonText?: string
  cancelButtonText?: string
}

export interface DeleteConfirmDialogResult {
  deleteSourceFile: boolean
}

export function showDeleteConfirmDialog(options: DeleteConfirmDialogOptions): Promise<DeleteConfirmDialogResult> {
  return new Promise((resolve, reject) => {
    const visible = ref(true)

    const container = document.createElement('div')
    document.body.appendChild(container)

    let app: ReturnType<typeof createApp> | null = null

    function destroy() {
      setTimeout(() => {
        app?.unmount()
        container.remove()
      })
    }

    app = createApp({
      render() {
        return h(DeleteConfirmDialog, {
          ...options,
          visible: visible.value,

          onConfirm(deleteSourceFile: boolean) {
            visible.value = false

            resolve({
              deleteSourceFile,
            })

            destroy()
          },

          onCancel() {
            visible.value = false

            reject(createAbortError())

            destroy()
          },
        })
      },
    })

    app?.mount(container)
  })
}
