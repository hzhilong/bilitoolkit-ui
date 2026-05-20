<script setup lang="ts">
import type { PageParams } from '@/types/page'
import { type ElForm, type ElInput } from 'element-plus'
import { computed, ref } from 'vue'

interface T {
  title: string
  id: number
  name: string
}
interface P {
  id: number
}
const tableData: T[] = []

for (let index = 0; index < 100; index++) {
  tableData.push({
    title: `title-${index}`,
    id: index,
    name: `name-${index}`,
  })
}
const id = ref<number | undefined>()
const params = computed(() => {
  return {
    id: id.value,
  } as P
})
const getFn = async ({ pageNum, pageSize }: PageParams, { id }: P) => {
  const list = id !== undefined ? tableData.filter((item) => item.id === id) : tableData
  const r = {
    data: list.slice((pageNum - 1) * pageSize, pageNum * pageSize),
    pageNum: pageNum,
    pageSize: pageSize,
    total: list.length,
    totalPages: Math.ceil(list.length / pageSize),
  }
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log(`getFn`, id)
  return r
}
const reset = () => {
  id.value = undefined
}
</script>

<template>
  <div class="home">
    <PageTable :fetch-page="getFn" title="测试数据" :page-sizes="[20, 30, 50]" :query-params="params" @reset="reset">
      <ElTableColumn prop="title" label="标题"></ElTableColumn>
      <ElTableColumn prop="id" label="id"></ElTableColumn>
      <ElTableColumn prop="name" label="名称"></ElTableColumn>
      <template #query>
        <ElForm :inline="true" label-position="left" label-width="auto">
          <ElFormItem label="id">
            <ElInput type="number" v-model.number="id"></ElInput>
          </ElFormItem>
        </ElForm>
      </template>
    </PageTable>
  </div>
</template>

<style lang="scss">
.home {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  > * {
    //    height: 100%;
  }
}
</style>
