<script setup lang="ts">
import type { PluginMenuItemProps } from '@/components/plugin/types'
import PluginMenuItem from '@/components/plugin/PluginMenuItem.vue'

withDefaults(defineProps<PluginMenuItemProps>(), {})
</script>

<template>
  <el-menu-item v-if="!menu.children || menu.children.length === 0" :index="menu.path">
    <template #title>{{ menu.title }}</template>
  </el-menu-item>
  <el-sub-menu v-else :index="menu.path">
    <template #title>{{ menu.title }}</template>
    <plugin-menu-item v-for="child in menu.children" :key="child.path" :menu="child"> </plugin-menu-item>
  </el-sub-menu>
</template>

<style scoped lang="scss"></style>
