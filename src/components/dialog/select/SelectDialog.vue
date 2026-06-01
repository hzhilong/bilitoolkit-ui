<script setup lang="ts" generic="T = unknown">
import type { SelectDialogProps } from '@/components/dialog/select/types'
import { watch, reactive, computed, ref, nextTick, useTemplateRef } from 'vue'
import { useLoadingData } from '@/composables/useLoadingData'
import { showError } from '@/utils/feedback'

const props = withDefaults(defineProps<SelectDialogProps<T>>(), {
  title: '请选择',
  multiple: false,
  canSelectAll: true,
  showCurrentSelection: true,
  confirmText: '确定',
  cancelText: '取消',
  noSelectionTip: '未选择数据',
})

const visible = defineModel<boolean>('visible', { required: true })
const allOptions = reactive<T[]>([])
const selectedList = defineModel<T[]>({ required: true })
const initWidth = ref<number>(0)
const listRef = useTemplateRef<HTMLDivElement>('listRef')
const { loading, loadingData } = useLoadingData()

const init = loadingData(async (onCleanup) => {
  let isCleanup = false
  onCleanup(() => {
    isCleanup = true
  })

  const options = typeof props.options === 'function' ? await props.options() : props.options

  if (!isCleanup) {
    ;(allOptions as T[]).splice(0, allOptions.length, ...options)
    nextTick(() => {
      initWidth.value = listRef.value?.clientWidth ?? 0
    })
  }
})

watch(
  visible,
  async (newVal, _, onCleanup) => {
    if (!newVal) return
    await init(onCleanup)
  },
  { immediate: true },
)

const emits = defineEmits<{
  confirm: [list: T[]]
  cancel: []
}>()
const handleCancel = () => {
  visible.value = false
  emits('cancel')
}
const handleSubmit = () => {
  const list = selectedList.value
  if (!list || list.length === 0) {
    showError(props.noSelectionTip)
    return
  }
  visible.value = false
  emits('confirm', list)
}
const currentSelectionVisible = computed(() => {
  return props.showCurrentSelection && !loading.value && selectedList.value.length > 0
})
const isItemSelected = (item: T) => {
  return selectedList.value.includes(item)
}
const handleItemClick = (item: T) => {
  const i = selectedList.value.indexOf(item)
  if (i > -1) {
    selectedList.value.splice(i, 1)
  } else if (props.multiple) {
    selectedList.value.push(item)
  } else {
    selectedList.value.splice(0, selectedList.value.length, item)
  }
}

const isAllSelected = computed(() => {
  return (allOptions as T[]).every((item: T) => {
    return (selectedList.value as T[]).includes(item)
  })
})

const toggleAll = () => {
  if (isAllSelected.value) {
    selectedList.value = []
  } else {
    selectedList.value.splice(0, selectedList.value.length, ...(allOptions as T[]))
  }
}
</script>

<template>
  <div class="select-dialog">
    <el-dialog
      :title="title"
      v-model="visible"
      style="width: fit-content; min-width: 300px; max-width: 800px; max-height: 88vh; overflow: auto"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="true"
      align-center
    >
      <div class="dialog-content" v-loading="loading" :class="loading ? 'loading' : ''">
        <div ref="listRef" class="option-list">
          <div
            class="option-item"
            v-for="item in allOptions"
            :key="getDataId(item)"
            :class="isItemSelected(item) ? 'selected' : ''"
            @click="handleItemClick(item)"
          >
            <slot name="item">
              <span class="select-icon" :class="multiple ? 'checkbox' : 'radio'"></span>
              <span class="option-item-label">
                <slot name="item-label">{{ getDataLabel(item) }}</slot>
              </span>
            </slot>
          </div>
        </div>
        <div class="current-selection" v-if="currentSelectionVisible" :style="{ width: `${initWidth}px` }">
          <span v-if="multiple">已选择（{{ selectedList.length }}）：</span>
          <span v-else>已选择：</span>
          <div class="current-selection-list" :style="{ display: multiple ? 'flex' : 'contents' }">
            <span v-for="item in selectedList" :key="getDataId(item)">{{ getDataLabel(item) }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <span
          v-if="multiple && canSelectAll"
          class="select-all"
          @click="toggleAll"
          :class="isAllSelected ? 'selected' : ''"
          ><span class="select-icon"></span>全选</span
        >
        <el-button @click="handleCancel">{{ cancelText }}</el-button>
        <el-button type="primary" @click="handleSubmit" :disabled="loading">{{ confirmText }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.select-dialog {
  display: contents;

  ::v-deep(.el-dialog) {
    display: flex;
    flex-direction: column;
    padding: 0;

    .el-dialog__header {
      padding: 0 10px;
      line-height: 48px;
    }

    .el-dialog__body {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    .el-dialog__footer {
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .select-all {
        margin-right: auto;
        font-size: 12px;
        line-height: normal;
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;

        .select-icon {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 2px solid var(--el-border-color);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }

        &.selected .select-icon {
          border-color: var(--el-color-primary);
          background-color: var(--el-color-primary);

          &::before {
            content: '✓';
          }
        }
      }
    }
  }

  .dialog-content {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    height: fit-content;
    border-top: 1px solid var(--el-border-color-light);
    border-bottom: 1px solid var(--el-border-color-light);

    &.loading {
      min-height: 100px;
    }

    .option-list {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;

      .option-item {
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;

        .select-icon {
          width: 16px;
          height: 16px;

          &.checkbox {
            font-size: 12px;
            border-radius: 4px;
            border: 2px solid var(--el-border-color);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            line-height: normal;
          }

          &.radio {
            border-radius: 50%;
            border: 2px solid var(--el-color-primary);
          }
        }

        &.selected {
          background-color: var(--app-color-primary-transparent-10);

          .checkbox {
            border-color: var(--el-color-primary);
            background-color: var(--el-color-primary);

            &::before {
              content: '✓';
            }
          }

          .radio {
            background-color: var(--el-color-primary);
            box-shadow: inset 0 0 0 2px #fff;
          }
        }

        .option-item-label {
          color: var(--el-text-color-primary);
          font-size: 14px;
          line-height: normal;
        }
      }
    }

    .current-selection {
      text-align: left;
      color: var(--el-text-secondary);
      padding: 10px;
      border-top: 1px solid var(--el-border-color-light);

      .current-selection-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0 8px;
        max-height: 88px;
        overflow-y: auto;
      }
    }
  }
}
</style>
