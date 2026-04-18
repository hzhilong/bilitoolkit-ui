<script setup lang="ts">
import { useTestDataStore } from '@/stores/test-data.ts'

const user = useTestDataStore().state.user
</script>

<template>
  <div>
    <bili-user-card :user="user"></bili-user-card>
  </div>
</template>

<style lang="scss"></style>
