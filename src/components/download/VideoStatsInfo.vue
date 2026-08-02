<script setup lang="ts">
import { type VideoStat } from '@ybgnb/bili-api'
import { computed } from 'vue'
import { formatStatCount } from '@/utils/format'

type AvailableStat = keyof Pick<VideoStat, 'like' | 'coin' | 'favorite' | 'share' | 'reply'>
const props = withDefaults(
  defineProps<{
    stat: Omit<VideoStat, 'dislike'>
    fields?: AvailableStat[]
  }>(),
  {
    fields: () => ['like', 'coin', 'favorite', 'share', 'reply'],
  },
)
const iconMap: Record<AvailableStat, string> = {
  like: 'thumb-up',
  coin: 'money-cny-circle',
  favorite: 'star',
  share: 'share-forward',
  reply: 'discuss',
}
const stats = computed<
  {
    icon: string
    value: string
  }[]
>(() => {
  const list = []
  for (const field of props.fields) {
    list.push({
      icon: iconMap[field],
      value: formatStatCount(props.stat[field]),
    })
  }
  return list
})
</script>

<template>
  <div class="video-stats-info">
    <div class="stat-item" v-for="item in stats" :key="item.icon">
      <AppIcon :icon="item.icon"></AppIcon>
      <span class="value">{{ item.value }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.video-stats-info {
  display: flex;
  align-items: center;
  font-size: 12px;
  gap: 20px;

  .stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}
</style>
