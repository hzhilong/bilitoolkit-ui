<script setup lang="ts">
import { computed, onMounted } from 'vue'
import defaultFace from '@/assets/images/noface.jpg'
import type { PluginMenuData, PluginMenusProps } from '@/components/plugin/types'
import { toolkitApi } from '@/api/toolkit-api'
import { useSelectedUserStore } from '@/stores/selected-user'
import { storeToRefs } from 'pinia'
import { showError } from '@/utils/feedback'

defineProps<PluginMenusProps>()

const selectedUserStore = useSelectedUserStore()
const { user } = storeToRefs(selectedUserStore)

const face = computed(() => {
  return user.value?.face || defaultFace
})

const levelImg = computed(() => {
  return new URL(`../../assets/images/user_level/level_${user.value?.level ?? 0}.svg`, import.meta.url).href
})

const switchUser = async () => {
  selectedUserStore.setUser(await toolkitApi.user.switchUser(true))
}

const cancelChoose = () => {
  selectedUserStore.deleteUser()
}
const emit = defineEmits<{
  handleMenuSelect: [menu: PluginMenuData]
}>()
const handleMenuSelect = (menu: PluginMenuData): void => {
  if (menu) {
    emit('handleMenuSelect', menu)
  }
}
onMounted(async () => {
  if (user.value) {
    // 更新当前用户信息并验证当前cookie有效性
    try {
      const newInfo = await toolkitApi.user.getMyInfoByCookie(user.value.userCookie)
      selectedUserStore.setUser(newInfo)
    } catch {
      showError(`当前用户 cookie 已失效`)
      selectedUserStore.deleteUser()
    }
  }
})
</script>

<template>
  <div class="plugin-page-header">
    <plugin-menus
      class="plugin-page-header__menus"
      :active-index="activeIndex"
      :menus="menus"
      @handle-select="handleMenuSelect"
    ></plugin-menus>
    <div class="plugin-page-header__user-container">
      <template v-if="user">
        <el-popover placement="bottom-end" width="auto" trigger="hover">
          <template #reference>
            <div class="plugin-page-header__user-container__info">
              <img class="plugin-page-header__user-container__info__face" :src="face" alt="face" />
              <AppTooltip class="plugin-page-header__user-container__info__name" :content="user.name" />
              <img class="plugin-page-header__user-container__info__level" :src="levelImg" alt="level img" />
            </div>
          </template>
          <template #default>
            <bili-user-card :user="user" />
          </template>
        </el-popover>
      </template>
      <template v-else>
        <div class="plugin-page-header__user-container__info">
          <img class="plugin-page-header__user-container__info__face" alt="" src="../../assets/images/noface.jpg" />
          <span class="plugin-page-header__user-container__info__name">未登录</span>
        </div>
      </template>
      <el-dropdown placement="bottom-end" trigger="click" size="default">
        <span class="plugin-page-header__user-container__arrow">▼</span>
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

  &__user-container {
    display: flex;
    align-items: center;
    font-size: 16px;
    gap: 0.5em;
    height: 40px;
    border-bottom: 1px solid var(--el-menu-border-color);
    padding-right: 1em;
    min-width: 0;
    padding-left: 60px;
    background-color: var(--el-menu-bg-color);

    .bili-user-card:hover {
      box-shadow: unset;
    }

    &__info {
      display: flex;
      align-items: center;
      gap: 0.3em;
      height: calc(40px - 0.4em);
      padding: 0 0.3em;
      border-radius: 0.3em;
      box-sizing: border-box;
      //      border: 2px dashed var(--app-color-primary-transparent-5);
      overflow: hidden;

      &:hover {
        background-color: var(--app-color-primary-transparent-5);
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
      padding: 0.6em;
      cursor: pointer;
      border-radius: 0.2em;

      &:hover {
        background-color: var(--app-color-primary-transparent-20);
      }
    }
  }
}
</style>
