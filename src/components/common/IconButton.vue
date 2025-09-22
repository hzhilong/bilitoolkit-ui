<script setup lang="ts">
import AppIcon from '@/components/common/AppIcon.vue'

interface IconButtonProps {
  confirm?: string
  icon: string
  tip?: string
  iconSize?: string
}

withDefaults(defineProps<IconButtonProps>(), {
  iconSize: '18px',
})
const emit = defineEmits(['onClick'])

const handleClick = () => {
  emit('onClick')
}
</script>

<template>
  <template v-if="confirm">
    <el-popconfirm :title="confirm" placement="left" @confirm="handleClick">
      <template #reference>
        <AppIcon class="icon-btn" :icon="icon" :icon-size="iconSize" />
      </template>
    </el-popconfirm>
  </template>
  <template v-else-if="tip">
    <el-tooltip effect="dark" :content="tip" placement="top">
      <slot name="default">
        <AppIcon class="icon-btn" :icon="icon" @click="handleClick" :icon-size="iconSize" />
      </slot>
    </el-tooltip>
  </template>
  <template v-else>
    <slot name="default">
      <AppIcon class="icon-btn" :icon="icon" @click="handleClick" :icon-size="iconSize" />
    </slot>
  </template>
</template>

<style scoped lang="scss"></style>
