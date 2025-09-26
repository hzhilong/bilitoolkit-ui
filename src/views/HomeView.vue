<script setup lang="ts">
import { ref } from 'vue'
import type { BiliAccountCardProps } from '@/components/bili/types.ts'
import BiliAccountCard from '@/components/bili/BiliAccountCard.vue'

const sss = ref<BiliAccountCardProps>({
  account: {
    mid: 3546981758667253,
    name: '确定提交吗',
    sex: '保密',
    face: 'https://i1.hdslb.com/bfs/face/af98d7f4487b07e2a22331c4886407fa1b820726.jpg',
    sign: '',
    level: 2,
    moral: 70,
    silence: 0,
    email_status: 1,
    tel_status: 1,
    identification: 0,
  },
})
</script>

<template>
  <bili-account-card v-bind="sss" />
</template>

<style lang="scss">
</style>
