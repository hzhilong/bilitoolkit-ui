<script setup lang="ts">
import { ref } from 'vue'
import { BaseUtils } from '@ybgnb/utils'

const logs = ref<string[]>([])

function addLog(msg: string) {
  logs.value.push(`[${BaseUtils.getFormattedDateTime()}] ${msg}`)

  if (logs.value.length > 500) {
    logs.value.shift()
  }
}
defineExpose({
  addLog,
})
</script>

<template>
  <div class="log-print-box">
    <div v-for="(log, i) in logs" :key="i" v-html="log" class="log-print-box__line"></div>
  </div>
</template>

<style lang="scss">
.log-print-box {
  overflow-y: auto;
  background: var(--app-color-primary-transparent-2);
  color: var(--el-text-color-secondary);
  padding: 1em;
  box-sizing: border-box;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  display: flex;
  flex-direction: column;

  &__line a {
    color: var(--app-color-primary);
    text-decoration: underline;
  }
}
</style>
