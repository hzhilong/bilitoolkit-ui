/**
 * 加载框
 */
export interface LoadingDialogOptions {
  showCancel?: boolean
  onCancel?: () => void | Promise<void>
  message?: string
  // 自动关闭的延迟时间 ms
  autoCloseDelay?: number
}
