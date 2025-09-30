<script setup lang="ts">
import { computed } from 'vue'
import defaultFace from '@/assets/images/noface.jpg'
import type { PluginMenuInfo, PluginMenusProps } from '@/components/plugin/types.ts'
import { useSelectedAccountStore } from '@/stores/selected-account.ts'
import { toolkitApi } from '@/api/toolkit-api.ts'

defineProps<PluginMenusProps>()

const { state, deleteAccount, setAccount } = useSelectedAccountStore()
const account = computed(() => state.selectedAccount)

const face = computed(() => {
  return account.value?.face || defaultFace
})

const levelImg = computed(() => {
  return new URL(`../../assets/images/user_level/level_${account.value?.level ?? 0}.svg`, import.meta.url).href
})

const chooseAccount = async () => {
  setAccount(await toolkitApi.account.chooseAccount())
}

const cancelChoose = () => {
  deleteAccount()
}
const emit = defineEmits<{
  handleMenuSelect: [menu: PluginMenuInfo]
}>()
const handleMenuSelect = (menu: PluginMenuInfo): void => {
  if (menu) {
    emit('handleMenuSelect', menu)
  }
}
</script>

<template>
  <div class="plugin-page-header">
    <plugin-menus
      class="plugin-page-header__menus"
      :active-index="activeIndex"
      :menus="menus"
      @handle-select="handleMenuSelect"
    ></plugin-menus>
    <div class="plugin-page-header__account-container">
      <template v-if="account">
        <el-popover placement="bottom-end" :width="260" trigger="hover" :teleported="false">
          <template #reference>
            <div class="plugin-page-header__account-container__info">
              <img class="plugin-page-header__account-container__info__face" :src="face" />
              <span class="plugin-page-header__account-container__info__name">{{ account.name }}</span>
              <img class="plugin-page-header__account-container__info__level" :src="levelImg" />
            </div>
          </template>
          <template #default>
            <bili-account-card :account="account" />
          </template>
        </el-popover>
      </template>
      <template v-else>
        <div class="plugin-page-header__account-container__info">
          <img class="plugin-page-header__account-container__info__face" alt="" src="../../assets/images/noface.jpg" />
          <span class="plugin-page-header__account-container__info__name">未登录</span>
        </div>
      </template>
      <el-dropdown placement="bottom-end" trigger="click" size="default">
        <span class="plugin-page-header__account-container__arrow">▼</span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="chooseAccount">选择账号</el-dropdown-item>
            <el-dropdown-item v-if="account" @click="cancelChoose">取消选择</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss">
.plugin-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;

  &__menus {
    flex: 1;
  }

  &__account-container {
    display: flex;
    align-items: center;
    font-size: 16px;
    gap: 0.5em;
    height: var(--el-menu-horizontal-height);
    border-bottom: 1px solid var(--el-menu-border-color);
    padding-right: 1em;

    .bili-account-card:hover {
      box-shadow: unset;
    }

    &__info {
      display: flex;
      align-items: center;
      gap: 0.3em;
      height: calc(var(--el-menu-horizontal-height) - 0.4em);
      padding: 0 0.3em;
      border-radius: 0.3em;
      box-sizing: border-box;
      border: 2px dashed var(--app-color-primary-transparent-25);
      overflow: hidden;

      &:hover {
        background-color: var(--app-color-primary-transparent-10);
      }

      &__face {
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }

      &__name {
      }

      &__level {
        width: 32px;
        height: 32px;
      }
    }

    &__arrow {
      padding: 0.3em;
      cursor: pointer;
      border-radius: 0.2em;

      &:hover {
        background-color: var(--app-color-primary-transparent-20);
      }
    }
  }
}
</style>
