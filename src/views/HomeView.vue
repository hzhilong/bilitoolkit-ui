<script setup lang="ts">
import { showVirtualSelectDialog } from '@/components/dialog/select/virtualSelectService'

interface Data {
  id: number
  title: string
}

const options = async () => {
  return Array.from({ length: 1000000 }).map((item, i) => {
    return {
      id: i + 1,
      title: `options options options options options ${i + 1}`,
    }
  })
}

const defaultSelectedIds = () => {
  return Array.from({ length: 10 }).map((item, i) => {
    return i + 20
  })
}

const test = async () => {
  console.log(
    await showVirtualSelectDialog<Data, 'id'>({
      title: '测试，请选择',
      options: options,
      defaultSelectedIds: defaultSelectedIds,
      getDataLabel(data: Data): string {
        return data.title
      },
      idKey: 'id',
      multiple: true,
      canSelectAll: true,
      itemHeight: 28,
      itemWidth: 300,
    }),
  )
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
</style>
