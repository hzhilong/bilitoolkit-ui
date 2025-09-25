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
  }>(),
  {},
)

const theme = useAppThemeStore()
const iconClass = computed(() => {
  if (theme.state.dark) {
    return `ri-${props.icon}-fill`
  } else {
    return `ri-${props.icon}-line`
  }
})
</script>

<template>
  <i :class="iconClass" class="icon-font"></i>
</template>

<style lang="scss"></style>
