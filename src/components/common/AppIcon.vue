<script setup lang="ts">
import { useAppThemeStore } from '@/stores/app-theme'
import { computed } from 'vue'

/**
 * remix 图标
 * 根据应用主题自动切换图标类型
 */
const props = withDefaults(
  defineProps<{
    icon: string
    iconSize?: string
  }>(),
  {
    iconSize: '18px',
  },
)

const theme = useAppThemeStore()
const iconClass = computed(() => {
  if (theme.state.dark) {
    return `ri-${props.icon}-fill`
  } else {
    return `ri-${props.icon}-line`
  }
})
const getStyles = computed(() => {
  return {
    width: props.iconSize,
    height: props.iconSize,
    fontSize: props.iconSize,
    lineHeight: props.iconSize,
  }
})
</script>

<template>
  <i :class="iconClass" :style="getStyles"></i>
</template>

<style scoped lang="scss"></style>
