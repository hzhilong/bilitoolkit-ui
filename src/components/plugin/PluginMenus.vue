<script setup lang="ts">
import type { PluginMenuData, PluginMenusProps } from '@/components/plugin/types.ts'
import PluginMenuItem from '@/components/plugin/PluginMenuItem.vue'
import { computed, type Slots, useSlots } from 'vue'

const props = defineProps<PluginMenusProps>()
const buildIndexMap = (
  menus: PluginMenuData[],
  map = new Map<string, PluginMenuData>(),
): Map<string, PluginMenuData> => {
  menus.forEach((menu) => {
    map.set(menu.path, menu)
    if (menu.children && menu.children.length > 0) {
      buildIndexMap(menu.children, map)
    }
  })
  return map
}
const indexMap = computed(() => buildIndexMap(props.menus))
const emit = defineEmits<{
  handleSelect: [menu: PluginMenuData]
}>()
const handleSelect = (selectIndex: string): void => {
  const menu = indexMap.value.get(selectIndex)
  if (menu) {
    emit('handleSelect', menu)
  }
}

const slots: Slots = useSlots()

// 判断是否存在左侧插槽
const hasLeftItemSlot = computed(() => {
  // 优先判断 left-item 插槽，如果没有再判断 left 插槽
  return !!slots['left-item'] || !!slots.left
})

const hasRightItemSlot = computed(() => {
  return !!slots['right-item'] || !!slots.right
})
</script>

<template>
  <el-menu
    :default-active="activeIndex"
    class="plugin-menus"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <template v-if="hasLeftItemSlot">
      <slot name="left-item">
        <!-- 默认左侧菜单 -->
        <el-menu-item index="-left" style="margin-right: auto">
          <slot name="left"></slot>
        </el-menu-item>
      </slot>
    </template>

    <plugin-menu-item v-for="menu in menus" :key="menu.path" :menu="menu" :index="String(menu.path)">
    </plugin-menu-item>

    <template v-if="hasRightItemSlot">
      <slot name="right-item">
        <!-- 默认左侧菜单 -->
        <el-menu-item index="-right" style="margin-left: auto">
          <slot name="right"></slot>
        </el-menu-item>
      </slot>
    </template>
  </el-menu>
</template>

<style scoped lang="scss"></style>
