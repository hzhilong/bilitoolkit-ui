<script setup lang="ts">
import { processDialog } from '@/components/dialog/process/service'

const test = async () => {
  processDialog.show({
    message: 'Loading 1',
    //    showCancel: true,
  })
}
</script>

<template>
  <div>
    <el-button @click="test">测试</el-button>
  </div>
</template>

<style lang="scss">
body {
  background: var(--app-bg-color-page) !important;
  padding: 100px !important;
}
.options {
  position: absolute;
  right: 0;
  top: 0;
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  > i {
    width: 28px;
    height: 28px;
    padding: 5px 4px 3px 4px;
    font-size: 20px;
    cursor: pointer;
    box-sizing: border-box;
    transition: background 0.3s ease;

    &:hover {
      background: var(--app-color-primary-transparent-15);
    }
  }
}
</style>
