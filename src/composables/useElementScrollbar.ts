import { onBeforeUnmount, type Ref, ref, watch, type MaybeRefOrGetter, toValue } from 'vue'

type ScrollbarDirection = 'x' | 'y'

export function useElementScrollbar(el: MaybeRefOrGetter<HTMLElement | undefined>) {
  const hasHorizontalScrollbar = ref(false)
  const hasVerticalScrollbar = ref(false)
  const hasScrollbar = ref(false)

  let resizeObserver: ResizeObserver | null = null
  let mutationObserver: MutationObserver | null = null

  const checkScrollbar = () => {
    const element = toValue(el)

    if (!element) {
      hasHorizontalScrollbar.value = false
      hasVerticalScrollbar.value = false
      hasScrollbar.value = false
      return
    }

    hasHorizontalScrollbar.value = element.scrollWidth > element.clientWidth

    hasVerticalScrollbar.value = element.scrollHeight > element.clientHeight

    hasScrollbar.value = hasHorizontalScrollbar.value || hasVerticalScrollbar.value
  }

  watch(
    () => toValue(el),
    (element) => {
      resizeObserver?.disconnect()
      mutationObserver?.disconnect()

      if (!element) return

      checkScrollbar()

      resizeObserver = new ResizeObserver(() => {
        checkScrollbar()
      })

      resizeObserver.observe(element)

      mutationObserver = new MutationObserver(() => {
        checkScrollbar()
      })

      mutationObserver.observe(element, {
        childList: true,
        subtree: true,
        characterData: true,
      })
    },
    {
      immediate: true,
    },
  )

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    mutationObserver?.disconnect()
  })

  return {
    hasHorizontalScrollbar,
    hasVerticalScrollbar,
    hasScrollbar,

    checkScrollbar,
  }
}
