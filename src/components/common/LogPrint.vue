<script setup lang="ts">
import { ref, useTemplateRef, nextTick } from 'vue'
import { getFormattedDateTime } from '@ybgnb/utils'

const logs = ref<string[]>([])
const logBoxRef = useTemplateRef<HTMLDivElement>('logBoxRef')

function addLog(msg: string) {
  logs.value.push(`[${getFormattedDateTime()}] ${msg}`)

  if (logs.value.length > 500) {
    logs.value.shift()
  }
  nextTick(() => {
    if (logBoxRef.value) {
      logBoxRef.value.scrollTop = logBoxRef.value.scrollHeight
    }
  })
}
const reset = () => {
  logs.value = []
}
defineExpose({
  addLog,
  reset,
})
</script>

<template>
  <div ref="logBoxRef" class="log-print-box">
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
