import { ElMessage, ElMessageBox, type ElMessageBoxOptions, type MessageParams } from 'element-plus'
import { toolkitApi } from '@/api/toolkit-api'
import { BiliApiBusinessError } from '@ybgnb/bili-api'
import { getErrorMessage, isCanceledError, createAbortError, serializeError } from '@ybgnb/utils'

function saveErrorLog(error: unknown) {
  toolkitApi.system
    .saveLog({
      level: 'error',
      data: [JSON.stringify(serializeError(error))],
    })
    .catch()
}

/**
 * 统一处理错误
 */
export const handleError = (error: unknown) => {
  if (isCanceledError(error)) {
    // 操作中止
    return
  }
  if (error) {
    console.error(error)
    if (toolkitApi && toolkitApi.system) {
      saveErrorLog(error)
    }
    if (error instanceof BiliApiBusinessError) {
      showError(`${error.message} (${error.responseCode})`)
    } else {
      showError(getErrorMessage(error))
    }
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
          dangerouslyUseHTMLString: true,
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
        reject(createAbortError())
      })
  })
}

/**
 * 按顺序依次显示多个确认弹窗，任意一步取消都会中断后续确认。
 */
export async function showConfirmSequence(confirms: Array<Parameters<typeof showConfirm>>) {
  for (const [message, title, options] of confirms) {
    await showConfirm(message, title, options)
  }
}
