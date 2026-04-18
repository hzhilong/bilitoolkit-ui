import { ElMessage, ElMessageBox, type ElMessageBoxOptions, type MessageParams } from 'element-plus'
import { toolkitApi } from '@/api/toolkit-api.ts'
import { BiliAbortError, BiliApiBusinessError } from '@ybgnb/bili-api'
import { AbortError, getErrorMessage } from '@ybgnb/utils'

/**
 * 统一处理错误
 */
export const handleError = (error: unknown) => {
  if (error && (error instanceof AbortError || error instanceof BiliAbortError)) {
    // 操作中止
    return
  }
  if (error) {
    // 打印错误
    if (error instanceof BiliApiBusinessError) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    // 保存日志
    toolkitApi.system
      .saveLog({
        level: 'error',
        message: error,
      })
      .then()
    // 显示错误
    showToast({
      message: getErrorMessage(error),
      type: 'error',
    })
  } else {
    showToast({
      message: '未知错误',
      type: 'error',
    })
  }
}

/**
 * 显示提示
 * @param message
 */
export function showToast(message: string): void
export function showToast({
  message,
  type,
  duration,
}: {
  message: string
  type?: 'success' | 'warning' | 'info' | 'error'
  duration?: number
}): void
export function showToast(
  config:
    | string
    | {
        message: string
        type?: 'success' | 'warning' | 'info' | 'error'
        duration?: number
      },
): void {
  const options: MessageParams = {
    message: '',
    type: 'success',
    duration: 3000,
  }
  if (typeof config === 'string') {
    options.message = config
  } else {
    Object.assign(options, config)
  }
  ElMessage(options)
}

/**
 * 显示错误提示
 */
export function showError(msg: string): void {
  showToast({
    message: msg,
    type: 'error',
  })
}
/**
 * 显示警告提示
 */
export function showWarning(msg: string): void {
  showToast({
    message: msg,
    type: 'warning',
  })
}

/**
 * 显示确认提示
 */
export function showConfirm(message: string, title: string = '提示', options: ElMessageBoxOptions = {}) {
  return new Promise<void>((resolve, reject) => {
    ElMessageBox.confirm(
      message,
      title,
      Object.assign(
        {
          autofocus: false,
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning',
        },
        options,
      ),
    )
      .then(() => {
        resolve()
      })
      .catch(() => {
        reject(new AbortError())
      })
  })
}
