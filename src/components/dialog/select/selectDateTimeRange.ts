import { createVNode, render, type AppContext } from 'vue'
import SelectDateTimeRange from './SelectDateTimeRange.vue'

interface DateTimeRangeResult {
  start: number
  end: number
}

interface SelectDateTimeRangeOptions {
  /**
   * 初始时间范围。
   *
   * 可以传：
   * - [Date, Date]
   * - [毫秒时间戳, 毫秒时间戳]
   * - [秒级时间戳, 秒级时间戳]
   */
  defaultValue?: [Date | number, Date | number]

  /**
   * Vue appContext。
   *
   * 如果组件内部依赖全局 provide / plugin，
   * 建议传入当前 app._context。
   */
  appContext?: AppContext
}

function toDate(value: Date | number): Date {
  if (value instanceof Date) {
    return new Date(value.getTime())
  }

  // 小于 1e12 基本可以判断为秒级时间戳
  return new Date(value < 1e12 ? value * 1000 : value)
}

function toSeconds(value: Date | number): number {
  const date = value instanceof Date ? value : toDate(value)

  return Math.floor(date.getTime() / 1000)
}

export const selectDateTimeRange = async (
  options: SelectDateTimeRangeOptions = {},
): Promise<DateTimeRangeResult | null> => {
  return new Promise((resolve) => {
    const container = document.createElement('div')

    document.body.appendChild(container)

    let finished = false

    const cleanup = () => {
      render(null, container)
      container.remove()
    }

    const finish = (result: DateTimeRangeResult | null) => {
      if (finished) {
        return
      }

      finished = true
      cleanup()
      resolve(result)
    }

    const defaultValue = options.defaultValue ? (options.defaultValue.map(toDate) as [Date, Date]) : null

    const vnode = createVNode(SelectDateTimeRange, {
      modelValue: true,
      'onUpdate:modelValue': (value: boolean) => {
        if (!value) {
          finish(null)
        }
      },

      confirm: (value: [Date, Date]) => {
        finish({
          start: toSeconds(value[0]),
          end: toSeconds(value[1]),
        })
      },

      cancel: () => {
        finish(null)
      },
    })

    if (defaultValue) {
      // 通过组件实例设置初始值
      vnode.props!.defaultValue = defaultValue
    }

    if (options.appContext) {
      vnode.appContext = options.appContext
    }

    render(vnode, container)
  })
}
