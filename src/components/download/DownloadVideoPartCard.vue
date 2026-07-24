<script setup lang="ts">
import type { DownloadVideoPart } from 'bilitoolkit-types'
import { formatDuration } from '@ybgnb/utils'
import {
  audioQualityEntries,
  videoQualityEntries,
  videoCodecEntries,
  audioQualityMap,
  videoCodecIdMap,
  videoQualityMap,
} from '@ybgnb/bili-api'
import { computed } from 'vue'

const props = defineProps<{
  part: DownloadVideoPart
}>()

const audioQuality = computed(() => props.part.resources.find((t) => t.type === 'audio')?.source.audioQuality)
const videoQuality = computed(() => props.part.resources.find((t) => t.type === 'video')?.source.videoQuality)
const videoCodec = computed(() => props.part.resources.find((t) => t.type === 'video')?.source.videoCodec)
</script>

<template>
  <div class="download-video-part-card">
    <div class="left-info">
      <div>{{ part.snapshot.page }}P</div>
      <AppTooltip :content="part.snapshot.part">{{ part.snapshot.part }}</AppTooltip>
    </div>
    <div class="right-info">
      <el-text v-if="audioQuality" type="info" effect="plain">
        {{ audioQualityMap[audioQuality] }}
      </el-text>
      <el-text v-if="videoQuality" type="info" effect="plain">
        {{ videoQualityMap[videoQuality] }}
      </el-text>
      <el-text v-if="videoCodec" type="info" effect="plain">
        {{ videoCodecIdMap[videoCodec] }}
      </el-text>
      <span>{{ formatDuration(part.snapshot.duration) }}</span>
    </div>
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

  .right-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
</style>
