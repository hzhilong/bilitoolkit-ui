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
  <div class="user-card">
    <slot></slot>
    <div class="user-card__face-wrapper">
      <img class="user-card__face" alt="face" :src="face" />
      <span class="user-card--blocked" v-if="user.silence === 1">账号已封禁</span>
    </div>
    <div class="user-card__info">
      <div class="user-card__row">
        <AppTooltip class="user-card__name" :content="user.name"></AppTooltip>
        <img class="user-card__level" :src="levelImg" alt="level" />
      </div>
      <div class="user-card__row">
        <span class="user-card__uid-icon"></span>
        <span class="user-card__uid">{{ user.mid }}</span>
      </div>
      <div class="user-card__row">
        <span class="user-card__stat__item">
          <span class="user-card__stat__value">{{ user.following }}</span>
          <span class="user-card__stat__label">关注</span>
        </span>
        <span class="user-card__stat__item">
          <span class="user-card__stat__value">{{ user.follower }}</span>
          <span class="user-card__stat__label">粉丝</span>
        </span>
        <span class="user-card__stat__item">
          <span class="user-card__stat__value">{{ user.coins }}</span>
          <span class="user-card__stat__label">硬币</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.user-card {
  min-width: 300px;
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
  transition: box-shadow 0.3s ease;
  color: var(--el-text-color-regular);

  &:hover {
    box-shadow: var(--el-box-shadow-light);
  }

  &__face-wrapper {
    position: relative;
  }

  &__face {
    width: 58px;
    height: 58px;
    border-radius: 50%;
  }

  &--blocked {
    font-size: 10px;
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    color: #ff0000a8;
    white-space: nowrap;
  }

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
    align-items: start;
    white-space: nowrap;
  }

  &__row {
    width: 100%;
    display: flex;
    align-items: center;
  }

  &__name {
    font-size: 14px;
    user-select: text;
    color: var(--el-text-color-primary);
    text-shadow: var(--app-text-shadow);
  }

  &__level {
    width: 34px;
    height: 34px;
    margin-left: 6px;
  }

  &__uid-icon {
    height: 12px;
    width: auto;
    aspect-ratio: 61.58837890625 / 36.173736572265625;
    mask: url('../../assets/images/uid.svg') no-repeat center / contain;
    -webkit-mask: url('../../assets/images/uid.svg') no-repeat center / contain;
    background-color: var(--el-text-color-regular);
    margin-right: 2px;
    margin-bottom: 10px;
  }

  &__uid {
    font-size: 12px;
    user-select: text;
    margin-bottom: 10px;
  }

  &__stat {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
    margin-top: 6px;

    &__item {
      color: var(--el-text-color-secondary);
      margin-right: 10px;
    }

    &__value {
      color: var(--el-text-color-regular);
      margin-right: 2px;
    }
  }
}
</style>
