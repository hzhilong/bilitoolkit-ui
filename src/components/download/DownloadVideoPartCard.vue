<script setup lang="ts">
import type { DownloadVideoPart } from 'bilitoolkit-types'
import { AppTooltip } from 'bilitoolkit-ui'
import { formatDuration } from '@ybgnb/utils'

defineProps<{
  part: DownloadVideoPart
}>()
</script>

<template>
  <div class="download-video-part-card">
    <div class="left-info">
      <div>{{ part.snapshot.page }}P</div>
      <AppTooltip :content="part.snapshot.part">{{ part.snapshot.part }}</AppTooltip>
    </div>
    <div>{{ formatDuration(part.snapshot.duration) }}</div>
  </div>
</template>

<style scoped lang="scss">
.download-video-part-card {
  background-color: var(--app-bg-color-overlay);
  padding: 2px 10px;
  gap: 10px;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: space-between;
  cursor: pointer;

  &:hover {
    background-color: var(--app-bg-color-overlay-hover);
  }

  .left-info {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
</style>
