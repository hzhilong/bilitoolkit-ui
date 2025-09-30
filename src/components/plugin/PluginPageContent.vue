<script setup lang="ts"></script>

<template>
  <div class="plugin-page-container">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/abstracts/variables' as *;

.plugin-page-container {
  height: calc(100% - var(--el-menu-horizontal-height));
  display: flex;
  flex-direction: column;
  justify-items: start;
  gap: 10px;
  padding: 10px 0;
  box-sizing: border-box;
  color: var(--el-text-color-regular);
  overflow: auto;
}
</style>
