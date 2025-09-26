import { AbortedError, BaseUtils } from '@ybgnb/utils'
import { ElMessage, ElMessageBox, type ElMessageBoxOptions, type MessageParams } from 'element-plus'
import { toolkitApi } from '@/api/toolkit-api.ts'

/**
 * App工具，包含一些全局的方法
 */
export class AppUtils {
  /**
   * 统一处理异常
   * @param error
   */
  static handleError(error: unknown): void {
    if (error && error instanceof AbortedError) {
      AppUtils.message({
        message: error.message,
        type: 'warning',
      })
      return
    }
    console.error(error)
    toolkitApi.system.saveLog({
      level: 'error',
      message: error,
    })
    if (!error) {
      AppUtils.message({
        message: '未知错误',
        type: 'error',
      })
    } else {
      AppUtils.message({
        message: BaseUtils.getErrorMessage(error),
        type: 'error',
      })
    }
  }

  static message(message: string): void
  static message({
    message,
    type,
    duration,
  }: {
    message: string
    type?: 'success' | 'warning' | 'info' | 'error'
    duration?: number
  }): void

  static message(
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

  static showInfoMessage(msg: string): void {
    AppUtils.message({
      message: msg,
      type: 'info',
    })
  }

  static showErrorMessage(msg: string): void {
    AppUtils.message({
      message: msg,
      type: 'error',
    })
  }

  static confirm(message: string, title: string = '提示', options: ElMessageBoxOptions = {}) {
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
          reject(new AbortedError())
        })
    })
  }
}
