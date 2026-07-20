<script setup lang="ts">
import { type DownloadResourceType, downloadResourceNameMap } from 'bilitoolkit-types'
import { computed } from 'vue'
import { IconLabel } from 'bilitoolkit-ui'

const props = defineProps<{
  type: DownloadResourceType
}>()
const name = computed(() => downloadResourceNameMap[props.type])
const iconMap: Record<DownloadResourceType, string> = {
  audio: 'file-music',
  video: 'file-video',
  dm: 'keyboard',
  cover: 'image',
  subtitle: 'closed-captioning',
}
</script>

<template>
  <el-tag type="primary" effect="plain" disable-transitions size="small">
    <IconLabel :icon="iconMap[type]">{{ name }}</IconLabel>
  </el-tag>
</template>

<style scoped lang="scss"></style>
