<script setup lang="ts">
import defaultFace from '@/assets/images/noface.jpg'
import { computed } from 'vue'
import type { BiliAccountCardProps } from '@/components/bili/types.ts'

/**
 * 哔哩哔哩账号卡片信息
 */
const props = defineProps<BiliAccountCardProps>()

const face = computed(() => {
  return props.account.face || defaultFace
})

const levelImg = computed(() => {
  return new URL(`../../assets/images/user_level/level_${props.account.level}.svg`, import.meta.url).href
})
</script>

<template>
  <div class="bili-account-card">
    <slot></slot>
    <img class="bili-account-card__face" alt="face" :src="face" />
    <div class="bili-account-card__info">
      <div>
        <el-tooltip effect="light" :content="account.name" placement="top">
          <span class="txt-ellipsis bili-account-card__name">{{ account.name }}</span>
        </el-tooltip>
        <img class="bili-account-card__level" :src="levelImg" alt="level" />
      </div>
      <div class="bili-account-card__mid">UID: {{ account.mid }}</div>
      <div class="bili-account-card__stat">
        <span class="bili-account-card__stat__item">
          <span class="value">{{ account.following }}</span>
          <span>关注</span>
        </span>
        <span class="bili-account-card__stat__item">
          <span class="value">{{ account.follower }}</span>
          <span>粉丝</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.bili-account-card {
  min-width: 230px;
  border: 2px solid var(--el-border-color);
  border-radius: 12px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
  user-select: none;
  box-sizing: border-box;
  font-size: 14px;

  &:hover {
    box-shadow: var(--el-box-shadow);
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
