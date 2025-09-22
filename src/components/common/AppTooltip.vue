<script setup lang="ts">

import AppIcon from '@/components/common/AppIcon.vue'

interface TooltipProps {
  content?: string
  type?: 'ltr' | 'rtl'
  // 图标类名
  iconClass?: string
  contentClass?: string
}

withDefaults(defineProps<TooltipProps>(), {
  type: 'rtl',
})
</script>

<template>
  <div class="tooltip">
    <div name="label">
      <AppIcon v-if="iconClass" :icon="iconClass" />
    </div>
    <template v-if="content">
      <el-tooltip effect="light" :content="content" placement="top">
        <slot name="default">
          <div v-if="type === 'rtl'"  v-bind="$attrs" class="tooltip__content txt-reverse-ellipsis" :class="contentClass">
            &lrm;{{ content }}&lrm;
          </div>
          <div v-else  v-bind="$attrs" class="tooltip__content txt-ellipsis" :class="contentClass">{{ content }}</div>
        </slot>
      </el-tooltip>
    </template>
  </div>
</template>

<style scoped lang="scss">
.tooltip {
  min-width: 0;

  > i {
    margin-right: 2px;
  }
}
</style>
