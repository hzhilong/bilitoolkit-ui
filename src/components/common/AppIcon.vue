<script setup lang="ts">
import { useAppThemeStore } from '@/stores/app-theme'
import { computed } from 'vue'
import { useTestDataStore } from '@/stores/test-data'

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
let theme
if (useTestDataStore().state.isTest) {
  theme = { state: { dark: false } }
} else {
  theme = useAppThemeStore()
}
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
