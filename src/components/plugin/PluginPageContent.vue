<script setup lang="ts"></script>

<template>
  <div class="plugin-page-container">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/abstracts/variables' as *;

.plugin-page-container {
  height: calc(100% - var(--el-menu-horizontal-height) - 20px);
  display: flex;
  flex-direction: column;
  justify-items: start;
  gap: 10px;
  margin-top: 20px;
  box-sizing: border-box;
  color: var(--el-text-color-regular);
  overflow: auto;
}
</style>
