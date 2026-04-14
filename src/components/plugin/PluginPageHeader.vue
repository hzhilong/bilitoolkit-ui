<script setup lang="ts">
import { computed } from 'vue'
import defaultFace from '@/assets/images/noface.jpg'
import type { PluginMenuData, PluginMenusProps } from '@/components/plugin/types.ts'
import { toolkitApi } from '@/api/toolkit-api.ts'
import { useSelectedUserStore } from '@/stores/selected-user.ts'

defineProps<PluginMenusProps>()

const { state, deleteUser, setUser } = useSelectedUserStore()
const user = computed(() => state.selectedUser)

const face = computed(() => {
  return user.value?.face || defaultFace
})

const levelImg = computed(() => {
  return new URL(`../../assets/images/user_level/level_${user.value?.level ?? 0}.svg`, import.meta.url).href
})

const switchUser = async () => {
  setUser(await toolkitApi.bili.switchUser())
}

const cancelChoose = () => {
  deleteUser()
}
const emit = defineEmits<{
  handleMenuSelect: [menu: PluginMenuData]
}>()
const handleMenuSelect = (menu: PluginMenuData): void => {
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
      <template v-if="user">
        <el-popover placement="bottom-end" :width="260" trigger="hover" :teleported="false">
          <template #reference>
            <div class="plugin-page-header__account-container__info">
              <img class="plugin-page-header__account-container__info__face" :src="face" />
              <span class="plugin-page-header__account-container__info__name">{{ user.name }}</span>
              <img class="plugin-page-header__account-container__info__level" :src="levelImg" />
            </div>
          </template>
          <template #default>
            <bili-user-card :user="user" />
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
            <el-dropdown-item @click="switchUser">选择用户</el-dropdown-item>
            <el-dropdown-item v-if="user" @click="cancelChoose">取消选择</el-dropdown-item>
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
