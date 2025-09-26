<script setup lang="ts">
import defaultFace from '@/assets/images/noface.jpg'
import { computed, ref } from 'vue'
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

const logoutBtnVisible = ref(false)
</script>

<template>
  <div class="bili-account-card" @mouseover="logoutBtnVisible = true" @mouseleave="logoutBtnVisible = false">
    <div class="options-close-btn" v-show="showLogoutBtn && logoutBtnVisible"></div>
    <img class="bili-account-card__face" alt="face" :src="face" />
    <div class="bili-account-card__info">
      <div>
        <span class="bili-account-card__name">{{ account.name }}</span>
        <img class="bili-account-card__level" :src="levelImg" alt="level" />
      </div>
      <div>
        <span
          >UID：<span class="bili-account-card__mid">{{ account.mid }}</span></span
        >
      </div>
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
  border-radius: 8px;
  border: 1px solid var(--app-color-primary-transparent-35);
  padding: 10px;
  width: 300px;
  display: flex;
  flex-direction: row;
  align-items: start;
  gap: 10px;
  position: relative;
  overflow: hidden;
  user-select: none;

  &:hover {
    box-shadow: var(--el-box-shadow);
  }

  &__face {
    width: 64px;
    height: 64px;
    border-radius: 50%;
  }

  &__mid,
  &__name {
    user-select: text;
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0px;
    align-items: start;
    white-space: nowrap;

    > div {
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

    &__item {
      color: var(--el-text-color-secondary);

      .value {
        color: var(--el-text-color-primary);
      }
    }
  }
}
</style>
