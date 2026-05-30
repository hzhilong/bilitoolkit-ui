<script setup lang="ts">
import { useSelectData } from '@/composables/useSelectData'
const types = Array.from({ length: 6 }).map((_, i) => `type-${i + 1}`)
const { selectedIds, toggleAll, isAllSelected } = useSelectData(
  () => types,
  (type: string) => type,
)
</script>

<template>
  <div>
    <div>
      <el-checkbox v-model="isAllSelected" @change="toggleAll">选中所有</el-checkbox>
    </div>
    <el-checkbox-group v-model="selectedIds">
      <el-checkbox v-for="item in types" :key="item" :label="item" :value="item"></el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<style lang="scss"></style>
