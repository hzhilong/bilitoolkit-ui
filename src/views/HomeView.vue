<script setup lang="ts">
import { useTestDataStore } from '@/stores/test-data'

const user = useTestDataStore().state.user
</script>

<template>
  <div style="padding: 20px">
    <el-config-provider :size="'small'" :z-index="3000">
      <bili-user-card :user="user"></bili-user-card>
    </el-config-provider>
  </div>
</template>

<style lang="scss"></style>
