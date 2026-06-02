<script setup lang="ts">
import { ref } from 'vue'
import SelectDialog from '@/components/dialog/select/SelectDialog.vue'
import { sleep } from '@ybgnb/utils'
import { showSelectDialog } from '@/components/dialog/select/selectService'
const types = Array.from({ length: 66 }).map((_, i) => `type-${i + 1}`)
const list = ref<string[]>([])
const visible = ref(false)
const options = async () => {
  await sleep(4000)
  return types
}
const test = async () => {
  const list = await showSelectDialog<string>({
    options: types,
    getDataId: (t) => t,
    getDataLabel: (t) => t,
    multiple: true,
    defaultSelectedList: ['type-4', 'type-5', 'type-6', 'type-7', 'type-8', 'type-9'],
  })
  console.log(`选择`, list)
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
