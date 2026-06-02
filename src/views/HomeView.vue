<script setup lang="ts">
import { showPageRangeDialog } from '@/components/dialog/page-range/pageRangeService'
const test = async () => {
  console.log(
    await showPageRangeDialog({
      pageSize: 20,
      total: 17,
    }),
  )
}
</script>

<template>
  <div>
    <div>
      <el-button @click="test">测试</el-button>
    </div>
  </div>
</template>

<style lang="scss"></style>
