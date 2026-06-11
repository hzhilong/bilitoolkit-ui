<script setup lang="ts">
import AppIcon from '@/components/common/AppIcon.vue'

interface IconButtonProps {
  confirm?: string
  icon: string
  tip?: string
}

withDefaults(defineProps<IconButtonProps>(), {})
const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <template v-if="tip">
    <template v-if="confirm">
      <el-popconfirm :title="confirm" placement="left" @confirm="handleClick">
        <template #reference>
          <span>
            <el-tooltip effect="light" :content="tip" placement="top" :show-after="800">
              <AppIcon class="icon-btn" :icon="icon" />
            </el-tooltip>
          </span>
        </template>
      </el-popconfirm>
    </template>
    <template v-else>
      <el-tooltip effect="light" :content="tip" placement="top" :show-after="800">
        <AppIcon class="icon-btn" :icon="icon" @click="handleClick" />
      </el-tooltip>
    </template>
  </template>
  <template v-else>
    <template v-if="confirm">
      <el-popconfirm :title="confirm" placement="left" @confirm="handleClick">
        <template #reference>
          <AppIcon class="icon-btn" :icon="icon" />
        </template>
      </el-popconfirm>
    </template>
    <template v-else>
      <AppIcon class="icon-btn" :icon="icon" @click="handleClick" />
    </template>
  </template>
</template>

<style lang="scss"></style>
