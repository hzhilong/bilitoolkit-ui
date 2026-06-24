export type ProcessDialogStatus = 'loading' | 'success' | 'error'

/**
 * 任务进度弹窗
 */
export interface ProcessDialogOptions {
  showCancel?: boolean
  onCancel?: () => void | Promise<void>
  onConfirm?: (status: ProcessDialogStatus) => void | Promise<void>
  percentage?: number
  message?: string
}
