/* eslint-disable @typescript-eslint/no-explicit-any */
import { toRaw } from 'vue'
import { CommonError } from '@ybgnb/utils'
import type { ToolkitApi } from 'bilitoolkit-api-types'
import { cloneDeepWith } from 'lodash-es'

let _toolkitApi: any
Object.defineProperty(window, 'toolkitApi', {
  get() {
    if (!_toolkitApi) {
      _toolkitApi = createApiProxy([])
    }

    return _toolkitApi!
  },
})

export const toolkitApi = window.toolkitApi

function createApiProxy<T extends ToolkitApi>(path: string[] = []) {
  return new Proxy(() => {}, {
    get(target, key: unknown) {
      if (typeof key !== 'string') return undefined

      // 实现 then
      if (key === 'then') {
        return (resolve: any, reject: any) => {
          // 这里复用 apply 逻辑
          Promise.resolve(Reflect.apply(target, undefined, [])).then(resolve, reject)
        }
      }

      // 保护关键属性
      if (key === '__proto__' || key === 'constructor') {
        return undefined
      }

      return createApiProxy([...path, key])
    },

    has(_, key: unknown) {
      // 避免被某些库误判
      if (key === 'then') return true
      return false
    },

    async apply(_, __, args: unknown[]) {
      const apiPath = path.join('.')
      try {
        let expandedApi: any = undefined

        for (let i = 0; i < path.length; i++) {
          const key = path[i]
          if (i === 0) {
            if (key in window.__toolkitApi) {
              expandedApi = window.__toolkitApi[key as keyof T]
            } else {
              break
            }
          } else {
            if (expandedApi && typeof expandedApi === 'object' && key in expandedApi) {
              expandedApi = (expandedApi as Record<string, any>)[key]
            } else {
              expandedApi = undefined
              break
            }
          }
        }

        if (typeof expandedApi === 'function') {
          return await expandedApi(...args)
        }

        return await window.__toolkitInvoke(apiPath, ...args)
      } catch (e) {
        throw new CommonError('API调用失败', e)
      }
    },
  }) as any
}

/**
 * 将数据处理转成可安全传给 IPC 的形式
 * @param obj
 */
export const toIPC = (obj: unknown) => {
  return cloneDeepWith(toRaw(obj), (val: unknown) => {
    if (typeof val === 'function' || val instanceof Window || val instanceof Element) {
      return undefined
    }
  })
}
