<script setup lang="ts">
import { formatTime, formatDuration } from '@ybgnb/utils'
import { Picture } from '@element-plus/icons-vue'
import type { DownloadVideo, DownloadVideoPart } from 'bilitoolkit-types'
import { computed } from 'vue'
import { formatStatCount } from '@/utils/format'
import VideoStatsInfo from '@/components/download/VideoStatsInfo.vue'
import DownloadResourceTag from '@/components/download/DownloadResourceTag.vue'
import DownloadVideoPartCard from '@/components/download/DownloadVideoPartCard.vue'
import { parseVideoZoneLabel } from '@/utils/parse-zone'
import { toolkitApi } from '@/api/toolkit-api'

const props = defineProps<{
  video: DownloadVideo
}>()
const info = computed(() => props.video.snapshot)
const resourceTypeList = computed(() => {
  const parts = props.video.parts
  if (parts.length >= 1) {
    return parts[0].resources.map((r) => r.type)
  }
  return []
})
const openVideoPage = async () => {
  window.open(`https://www.bilibili.com/video/${info.value.bvid}`)
}
const _openPartPage = async (page: number) => {
  window.open(`https://www.bilibili.com/video/${info.value.bvid}/?p=${page}`)
}

const emits = defineEmits<{
  (e: 'open-folder', partIndex: number): void
}>()
</script>

<template>
  <div class="download-video-card">
    <div class="info-row">
      <div class="info-left">
        <div class="cover" @click="openVideoPage">
          <div class="cover-image">
            <el-image :src="info.pic" fit="cover">
              <template #error>
                <div class="cover-placeholder">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="download-cover-stats">
              <IconLabel icon="video">{{ formatStatCount(info.stat.view) }}</IconLabel>
              <IconLabel icon="keyboard">{{ formatStatCount(info.stat.danmaku) }}</IconLabel>
              <span></span>
              <span></span>
              <span class="download-cover-stats__duration">{{ formatDuration(info.duration) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="info-right">
        <div class="info-row">
          <AppTooltip class="title" :content="info.title">{{ info.title }}</AppTooltip>
        </div>
        <div class="info-row">
          <div class="user-info">
            <img class="user-face" :src="info.owner.face" alt="face" />
            <div class="user-name">{{ info.owner.name }}</div>
          </div>
          <div class="zone">{{ parseVideoZoneLabel(info) }}</div>
          <div class="pubdate">{{ formatTime(info.pubdate) }}</div>
        </div>
        <div class="info-row stats">
          <div class="bvid">{{ info.bvid }}</div>
          <VideoStatsInfo :stat="info.stat"></VideoStatsInfo>
        </div>
        <div class="info-row">
          <div>下载的资源：</div>
          <DownloadResourceTag v-for="type in resourceTypeList" :key="type" :type="type" />
        </div>
      </div>
    </div>
    <div class="part-list">
      <div class="header">视频分P：</div>
      <DownloadVideoPartCard
        v-for="(p, pi) in video.parts"
        :key="p.snapshot.cid"
        :part="p"
        @click="emits('open-folder', pi)"
      ></DownloadVideoPartCard>
    </div>
  </div>
</template>

<style scoped lang="scss">
.download-video-card {
  color: var(--el-text-color-secondary);

  .info-row {
    display: flex;
    gap: 18px;
    align-items: stretch;
  }

  .info-left,
  .info-right {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .info-right {
    flex: 1;
    min-width: 0;
  }

  .cover {
    width: 180px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    gap: 4px;
    cursor: pointer;
    position: relative;
    border-radius: 6px;
    border: 1px solid var(--el-border-color-lighter);

    .cover-image {
      width: 100%;
      aspect-ratio: 16/9;
      border-radius: 6px;
      overflow: hidden;
      background: var(--el-fill-color-light);
      position: relative;
    }

    .cover-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: var(--el-text-color-placeholder);
    }

    .time {
      color: var(--el-text-color-regular);
    }
  }

  .download-cover-stats {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 2;
    box-sizing: border-box;
    padding: 16px 8px 6px;
    width: 100%;
    height: 38px;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    background-image: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
    color: #fff;
    font-size: 12px;
    line-height: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title {
    font-size: 16px;
    color: var(--el-text-color-primary);
  }

  .user-info {
    display: flex;
    align-items: center;
    color: var(--el-text-color-regular);

    .user-face {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1px solid var(--el-border-color);
      margin-right: 6px;
      flex-shrink: 0;
    }
  }

  .part-list {
    display: flex;
    flex-direction: column;
    padding: 10px 0 10px 10px;
    user-select: none;
    gap: 6px;

    .header {
      color: var(--el-text-color-regular);
    }
  }
}
</style>
