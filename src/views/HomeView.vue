<script setup lang="ts">
import { ref } from 'vue'
import SelectDialog from '@/components/dialog/select/SelectDialog.vue'
import { sleep } from '@ybgnb/utils'
const types = Array.from({ length: 66 }).map((_, i) => `type-${i + 1}`)
const list = ref<string[]>([])
const visible = ref(false)
const options = async () => {
  await sleep(4000)
  return types
}
</script>

<template>
  <div>
    <div>
      <el-button @click="visible = true">测试</el-button>
    </div>
    <SelectDialog
      :options="types"
      :get-data-label="(item: string) => item"
      :get-data-id="(item: string) => item"
      :multiple="false"
      v-model="list"
      v-model:visible="visible"
    ></SelectDialog>
  </div>
</template>

<style lang="scss"></style>
