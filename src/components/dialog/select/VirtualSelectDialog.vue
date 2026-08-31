<script setup lang="ts" generic="DATA = unknown, ID_KEY extends keyof DATA = keyof DATA">
import type { VirtualSelectDialogProps } from '@/components/dialog/select/types'
import { computed, shallowRef, triggerRef, toRaw, watch, ref } from 'vue'
import { useVirtualList } from '@vueuse/core'
import { useLoadingData } from '@/composables/useLoadingData'
import { showError } from '@/utils/feedback'
import { resolveValue } from '@ybgnb/utils'
import { useElementScrollbar } from '@/composables/useElementScrollbar'

const props = withDefaults(defineProps<VirtualSelectDialogProps<DATA, ID_KEY>>(), {
  title: '请选择',
  itemHeight: 28,
  itemWidth: 300,
  multiple: false,
  canSelectAll: true,
  confirmText: '确定',
  cancelText: '取消',
  noSelectionTip: '未选择数据',
  defaultSelectedIds: () => [],
})

const emits = defineEmits<{
  confirm: [list: DATA[]]
}>()

const visible = defineModel<boolean>({ required: true })

const allOptions = shallowRef<DATA[]>([])
const selectedIds = shallowRef(new Set<DATA[ID_KEY]>())

const { loading, loadingData } = useLoadingData()
const isInit = ref(false)

/**
 * useVirtualList 要求 itemHeight 的函数参数为 index，
 * 而原组件的 itemHeight 函数是以 DATA 为参数。
 *
 * 因此这里做一层转换：
 * index -> allOptions[index] -> props.itemHeight(item)
 */
const getItemHeight = (index: number): number => {
  const item = allOptions.value[index]

  if (typeof props.itemHeight === 'function') {
    return item == null ? 0 : props.itemHeight(item)
  }

  return props.itemHeight
}

const {
  list: virtualList,
  containerProps,
  wrapperProps,
} = useVirtualList(allOptions, {
  itemHeight: getItemHeight,
})

/**
 * useVirtualList 自己维护容器 ref。
 *
 * 这里直接拿 containerProps.ref 给 useElementScrollbar，
 * 不再需要 RecycleScroller 的 exposed component 实例。
 */
const { hasVerticalScrollbar } = useElementScrollbar(computed(() => containerProps.ref.value ?? undefined))

const init = loadingData(async (onCleanup) => {
  selectedIds.value.clear()

  let isCleanup = false

  onCleanup(() => {
    isCleanup = true
  })

  const defaultSelectedIds = new Set<DATA[ID_KEY]>(await resolveValue(props.defaultSelectedIds))

  const options = await resolveValue(props.options)

  if (!isCleanup) {
    selectedIds.value = defaultSelectedIds
    allOptions.value = options
  }
})

const handleOpened = () => {
  isInit.value = true
}

watch(
  visible,
  async (newVal, _, onCleanup) => {
    if (!newVal) {
      isInit.value = false
      return
    }

    await init(onCleanup)
  },
  { immediate: true },
)

const handleCancel = () => {
  visible.value = false
}

const handleSubmit = loadingData(() => {
  if (selectedIds.value.size === 0) {
    showError(props.noSelectionTip)
    return
  }

  const list: DATA[] = []

  for (const option of allOptions.value) {
    if (selectedIds.value.has(option[props.idKey])) {
      list.push(toRaw(option))
    }
  }

  emits('confirm', list)
  visible.value = false
})

const isItemSelected = (item: DATA) => {
  return selectedIds.value.has(item[props.idKey])
}

const handleItemClick = (item: DATA) => {
  const set = selectedIds.value
  const id = item[props.idKey]

  if (set.has(id)) {
    set.delete(id)
  } else {
    set.add(id)
  }

  triggerRef(selectedIds)
}

const isAllSelected = computed(() => {
  return allOptions.value.every((item: DATA) => {
    return isItemSelected(item)
  })
})

const toggleAllSelection = loadingData(() => {
  if (isAllSelected.value) {
    selectedIds.value = new Set<DATA[ID_KEY]>()
  } else {
    selectedIds.value = new Set<DATA[ID_KEY]>(allOptions.value.map((item) => item[props.idKey]))
  }

  triggerRef(selectedIds)
})

const clearSelection = loadingData(() => {
  selectedIds.value = new Set<DATA[ID_KEY]>()
  triggerRef(selectedIds)
})

const setSelectionIds = loadingData((ids: DATA[ID_KEY][]) => {
  selectedIds.value = new Set<DATA[ID_KEY]>(ids)
  triggerRef(selectedIds)
})

const getSelectionIds = () => selectedIds.value

defineExpose({
  clearSelection,
  getSelectionIds,
  setSelectionIds,
  toggleAllSelection,
})
</script>

<template>
  <div class="virtual-select-dialog">
    <el-dialog
      :title="title"
      v-model="visible"
      style="width: fit-content; height: 88vh"
      :style="{
        width: hasVerticalScrollbar ? `calc(${itemWidth}px + var(--app-scrollbar-width, 8px))` : `${itemWidth}px`,
      }"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="true"
      align-center
      @opened="handleOpened"
    >
      <div class="dialog-content" v-loading="loading" :class="loading ? 'loading' : ''">
        <div class="list-wrapper">
          <slot name="list">
            <div
              v-bind="containerProps"
              class="option-list"
              :style="[
                containerProps.style,
                {
                  paddingRight: hasVerticalScrollbar ? 'var(--app-scrollbar-width, 8px)' : '0',
                },
              ]"
            >
              <div v-bind="wrapperProps">
                <div v-for="virtualItem in virtualList" :key="virtualItem.index">
                  <slot name="item" :item="virtualItem.data" :index="virtualItem.index">
                    <div
                      class="option-item table-row"
                      :style="{
                        height: `${getItemHeight(virtualItem.index)}px`,
                        lineHeight: `${getItemHeight(virtualItem.index)}px`,
                        width: `${itemWidth}px`,
                      }"
                      :class="isItemSelected(virtualItem.data) ? 'selected' : ''"
                      @click="handleItemClick(virtualItem.data)"
                    >
                      <slot name="prefix-icon" :selected="isItemSelected(virtualItem.data)">
                        <span class="select-icon" :class="multiple ? 'checkbox' : 'radio'"></span>
                      </slot>

                      <span class="option-item-label">
                        <slot name="item-label" :item="virtualItem.data" :index="virtualItem.index">
                          <AppTooltip :content="getDataLabel(virtualItem.data)" />
                        </slot>
                      </span>
                    </div>
                  </slot>
                </div>
              </div>
            </div>
          </slot>
        </div>

        <div class="current-selection">
          <span v-if="multiple"> 已选择（{{ selectedIds.size }}） </span>
        </div>
      </div>

      <template #footer>
        <span
          v-if="multiple && canSelectAll"
          class="select-all"
          @click="toggleAllSelection"
          :class="isAllSelected ? 'selected' : ''"
        >
          <span class="select-icon"></span>
          全选
        </span>

        <slot name="footer-prepend" :allOptions="allOptions" :selectOptionIds="selectedIds" />

        <el-button @click="handleCancel">
          {{ cancelText }}
        </el-button>

        <el-button type="primary" @click="handleSubmit" :disabled="loading">
          {{ confirmText }}
        </el-button>

        <slot name="footer-append" :allOptions="allOptions" :selectOptionIds="selectedIds" />
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.virtual-select-dialog {
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
    border-top: 1px solid var(--el-border-color-light);
    border-bottom: 1px solid var(--el-border-color-light);

    .list-wrapper {
      flex: 1;
      min-height: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .option-list {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      position: relative;

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

        &:hover {
          background-color: var(--app-color-primary-transparent-15);
        }

        .option-item-label {
          flex: 1;
          min-width: 0;
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
      text-wrap: nowrap;
    }
  }
}
</style>
