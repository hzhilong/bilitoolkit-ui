import { onMounted, onUnmounted, useTemplateRef, ref } from 'vue'

/**
 * 监听指定模板元素的高度变化，并同步其当前高度。
 *
 * 基于 ResizeObserver 实现，
 * 内部使用 requestAnimationFrame 合并高频更新，避免连续触发造成重复计算。
 *
 * @template H 元素类型，默认 HTMLElement
 * @param refName 模板 ref 名称
 *
 * @returns
 * - elementRef: 绑定的模板元素引用
 * - height: 当前元素高度（clientHeight）
 * - updateHeight: 手动同步一次高度
 */
export const useElementHeight = <H extends HTMLElement = HTMLElement>(refName: string) => {
  const elementRef = useTemplateRef<H>(refName)
  const height = ref(0)

  const updateHeight = () => {
    if (elementRef.value?.clientHeight) {
      height.value = elementRef.value.clientHeight
    }
  }

  let observer: ResizeObserver | undefined
  let frameId = 0

  onMounted(() => {
    if (!elementRef.value) return

    updateHeight()

    observer = new ResizeObserver(() => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(updateHeight)
    })

    observer.observe(elementRef.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
    cancelAnimationFrame(frameId)
  })

  return {
    elementRef,
    height,
    updateHeight,
  }
}
