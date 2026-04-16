<script setup lang="ts">
import defaultFace from '@/assets/images/noface.jpg'
import { computed } from 'vue'
import type { BiliUserCardProps } from '@/components/bili/types.ts'

/**
 * 哔哩哔哩用户卡片信息
 */
const props = defineProps<BiliUserCardProps>()

const face = computed(() => {
  return props.user.face || defaultFace
})

const levelImg = computed(() => {
  // 这里使用【new URL(`./dir/${name}.png`, import.meta.url).href】的形式
  // 如果启用[库模式 + preserveModules]打包会报错->只是通过entryFileNames重命名文件。可以在打包时再使用插件拷贝这些资源
  return new URL(`../../assets/images/user_level/level_${props.user.level}.svg`, import.meta.url).href
})
</script>

<template>
  <div class="bili-user-card">
    <slot></slot>
    <img class="bili-user-card__face" alt="face" :src="face" />
    <div class="bili-user-card__info">
      <div>
        <el-tooltip effect="light" :content="user.name" placement="top">
          <span class="txt-ellipsis-right bili-user-card__name">{{ user.name }}</span>
        </el-tooltip>
        <img class="bili-user-card__level" :src="levelImg" alt="level" />
      </div>
      <div class="bili-user-card__mid">UID: {{ user.mid }}</div>
      <div class="bili-user-card__stat">
        <span class="bili-user-card__stat__item">
          <span class="value">{{ user.following }}</span>
          <span>关注</span>
        </span>
        <span class="bili-user-card__stat__item">
          <span class="value">{{ user.follower }}</span>
          <span>粉丝</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.bili-user-card {
  min-width: 230px;
  border: 2px solid var(--el-border-color);
  border-radius: 12px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin: 8px;
  position: relative;
  overflow: hidden;
  user-select: none;
  box-sizing: border-box;
  font-size: 14px;

  &:hover {
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
  }

  &__face {
    width: 58px;
    height: 58px;
    border-radius: 50%;
  }

  &__name {
    font-size: 16px;
    user-select: text;
  }

  &__mid {
    font-size: 12px;
    user-select: text;
  }

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
    align-items: start;
    white-space: nowrap;

    > :first-child {
      line-height: 1.5em;
      height: 1.5em;
    }

    > div {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  &__level {
    width: 32px;
    height: 32px;
  }

  &__stat {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
    margin-top: 6px;

    &__item {
      color: var(--el-text-color-secondary);

      .value {
        color: var(--el-text-color-regular);
      }
    }
  }
}
</style>
