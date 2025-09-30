<script setup lang="ts"></script>

<template>
  <div class="plugin-page-container">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/abstracts/variables' as *;

.plugin-page-container {
  display: flex;
  flex-direction: column;
  justify-items: start;
  padding: 10px;
  box-sizing: border-box;
  color: var(--el-text-color-regular);
  overflow: auto;

}
</style>
