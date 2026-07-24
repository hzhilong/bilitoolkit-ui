<script setup lang="ts">
import { type VideoStat } from '@ybgnb/bili-api'
import { computed } from 'vue'

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
  like: 'heart',
  coin: 'money-cny-circle',
  favorite: 'star',
  share: 'share-forward',
  reply: 'discuss',
}
const stats = computed<
  {
    icon: string
    value: number
  }[]
>(() => {
  const list = []
  for (const field of props.fields) {
    list.push({
      icon: iconMap[field],
      value: props.stat[field],
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
  gap: 20px;

  .stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}
</style>
