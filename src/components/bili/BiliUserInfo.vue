<script setup lang="ts">
import type { UserInfoWithCookie } from '@ybgnb/bili-api'

defineProps<{
  user: Pick<UserInfoWithCookie, 'mid' | 'face' | 'name'>
}>()
</script>

<template>
  <div class="user-info info-row">
    <img class="user-info__face" :src="user.face" alt="face" />
    <div class="user-info__right">
      <AppTooltip class="user-info__name" :content="user.name"></AppTooltip>
      <div class="info-row">
        <span class="user-info__uid-icon"></span>
        <span class="user-info__uid"> {{ user.mid }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.info-row {
  display: flex;
  align-items: center;
}

.user-info {
  min-height: 1em;
  font-size: 12px;

  &__face {
    width: 2em;
    height: 2em;
    border-radius: 50%;
    border: 1px solid var(--el-border-color);
    margin-right: 6px;
    flex-shrink: 0;
  }

  &__right {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
    flex-shrink: 1;
  }

  &__name {
    color: var(--el-text-color-regular);
    max-width: 100%;
  }

  &__uid-icon {
    height: 10px;
    width: auto;
    aspect-ratio: 61.58837890625 / 36.173736572265625;
    mask: url('../../assets/images/uid.svg') no-repeat center / contain;
    -webkit-mask: url('../../assets/images/uid.svg') no-repeat center / contain;
    background-color: var(--el-text-color-regular);
    margin-right: 2px;
  }

  &__uid {
    font-size: 0.9em;
    color: var(--el-text-color-placeholder);
    flex-shrink: 0;
  }
}
</style>
