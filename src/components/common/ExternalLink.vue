<script setup lang="ts">
import { toolkitApi } from '@/api/toolkit-api'

const props = defineProps<{
  url: string
}>()
const openUrl = () => {
  toolkitApi.system.browsePage(props.url)
}
</script>

<template>
  <span class="external-link" @click.prevent="openUrl">
    <slot></slot>
  </span>
</template>

<style lang="scss">
.external-link {
  color: var(--el-color-primary);
  cursor: pointer;
  padding: 0 4px;
  border-bottom: 1px solid var(--el-color-primary-light-4);

  &:hover {
    background-color: var(--el-color-primary-light-7);
  }
}
</style>
