<script setup lang="ts">
import { AppLoadingDialog } from '@/components/dialog/loading/loadingService.ts'
const test1 = async () => {
  AppLoadingDialog.show({
    loadingText: '测试工具箱API中...',
    canCancel: true,
  })
  setTimeout(() => {
    console.log('==============')
    AppLoadingDialog.hide()
  },2000)
}
</script>

<template>
    <el-button @click="test1()">测试1</el-button>
</template>

<style scoped lang="scss"></style>
