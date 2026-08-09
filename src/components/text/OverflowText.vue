<template>
  <el-tooltip :content="content" :disabled="!isOverflow" placement="top">
    <div class="auto-scroll-container" ref="containerRef">
      <div
        class="scroll-wrapper"
        :class="{ 'is-scrolling': isOverflow }"
        :style="{ '--duration': scrollDuration + 's' }"
      >
        <span class="text-content" ref="textRef">{{ content }}</span>
        <span class="spacer" v-show="isOverflow"></span>
        <template v-if="isOverflow">
          <span class="text-content">{{ content }}</span>
          <span class="spacer"></span>
        </template>
      </div>
    </div>
  </el-tooltip>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const props = defineProps<{
  content: string
}>()

const containerRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)

const isOverflow = ref(false)
const scrollDuration = ref(0) // 动态计算滚动动画的时长，保证滚动速度匀速

let resizeObserver: ResizeObserver | null = null

const checkOverflow = () => {
  if (!containerRef.value || !textRef.value) return

  const containerWidth = containerRef.value.clientWidth
  const textWidth = textRef.value.getBoundingClientRect().width

  if (textWidth > containerWidth) {
    isOverflow.value = true
    // 计算滚动时间：假设每秒滚动 50px，使得不同长度的文本滚动速度一致
    // 滚动距离是一个完整的 textWidth 加上 spacer 的宽度(30px)
    const scrollDistance = textWidth + 30
    scrollDuration.value = scrollDistance / 50
  } else {
    isOverflow.value = false
  }
}

watch(
  () => props.content,
  async () => {
    await nextTick()
    checkOverflow()
  },
)

onMounted(() => {
  checkOverflow()

  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      checkOverflow()
    })
    resizeObserver.observe(containerRef.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<style scoped>
.auto-scroll-container {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  box-sizing: border-box;
}

.scroll-wrapper {
  display: inline-block;
  white-space: nowrap;
  /* 使得容器宽度自适应内部文字撑开的大小 */
  width: max-content;
  --duration: 0;
}

/* 核心滚动逻辑 */
.scroll-wrapper.is-scrolling {
  /*
    由于渲染了两份完全一样的内容(text + spacer)，
    向左平移 50% 刚好是一个完整内容块的距离。
    此时视觉上首尾完美重合，形成无缝无限循环。
  */
  animation: marquee var(--duration) linear infinite;
}

/* 可选：如果你希望鼠标悬浮时暂停滚动，取消下面注释即可 */
/*
.scroll-wrapper.is-scrolling:hover {
  animation-play-state: paused;
}
*/

.text-content {
  display: inline-block;
}

.spacer {
  display: inline-block;
  width: 30px; /* 控制两段循环文本之间的留白距离 */
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
