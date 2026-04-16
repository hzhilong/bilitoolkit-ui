<script setup lang="ts">
import AppIcon from '@/components/common/AppIcon.vue'
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'

/**
 * 内容溢出提示
 */

interface TooltipProps {
  // 显示文本
  content?: string
  // 显示行数
  lines?: number
  // 省略方向
  ellipsis?: 'right' | 'left'
  // 图标类名
  iconClass?: string
}

const props = withDefaults(defineProps<TooltipProps>(), {
  lines: 1,
  ellipsis: 'right',
})
const lines = props.lines

const contentClass = () => {
  return {
    'txt-ellipsis-right': props.ellipsis === 'right',
    'txt-ellipsis-left': props.ellipsis === 'left',
    'single-line': props.lines === 1,
  }
}

const isOverflow = ref(false)
const refContent = useTemplateRef<HTMLDivElement>('refContent')
// 创建尺寸观测者，监听元素大小变化
const observer = new ResizeObserver(() => {
  if (refContent.value) {
    if (props.lines === 1) {
      // 单行
      isOverflow.value = refContent.value.scrollWidth > refContent.value.clientWidth
    } else {
      // 多行
      isOverflow.value = refContent.value.scrollHeight > refContent.value.clientHeight
    }
  }
})

onMounted(() => {
  if (refContent.value) {
    observer.observe(refContent.value)
  }
})

onUnmounted(() => {
  observer.disconnect()
})
</script>

<template>
  <div class="tooltip">
    <div class="label">
      <AppIcon v-if="iconClass" :icon="iconClass" />
    </div>
    <template v-if="content">
      <el-tooltip effect="light" :content="content" placement="top" :disabled="!isOverflow">
        <template #content>
          <slot name="tooltipContent" />
        </template>
        <div ref="refContent" v-bind="$attrs" class="tooltip__content" :class="contentClass()">
          <span
            ><slot>{{ content }}</slot></span
          >
        </div>
      </el-tooltip>
    </template>
  </div>
</template>

<style lang="scss">
.tooltip {
  min-width: 0;

  > i {
    margin-right: 2px;
  }

  &__content {
    &.single-line {
      white-space: nowrap;
    }

    &:not(.single-line) {
      display: -webkit-box;
      line-clamp: v-bind(lines);
      -webkit-line-clamp: v-bind(lines);
      -webkit-box-orient: vertical;
    }
  }
}
</style>
