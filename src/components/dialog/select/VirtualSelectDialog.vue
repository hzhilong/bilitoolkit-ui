<script setup lang="ts" generic="DATA = unknown, ID_KEY extends keyof DATA = keyof DATA">
import type { VirtualSelectDialogProps } from '@/components/dialog/select/types'
import { watch, computed, ref, useTemplateRef, toRaw, shallowRef, triggerRef } from 'vue'
import { useLoadingData } from '@/composables/useLoadingData'
import { showError } from '@/utils/feedback'
import { resolveValue } from '@ybgnb/utils'
import { RecycleScroller } from 'vue-virtual-scroller'
import type { ComponentExposed } from 'vue-component-type-helpers'
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
const refRecycleScroller = useTemplateRef<ComponentExposed<typeof RecycleScroller>>('refRecycleScroller')
const recycleScrollerEl = computed(() => refRecycleScroller.value?.el)
const { hasVerticalScrollbar } = useElementScrollbar(recycleScrollerEl)
const listKey = ref(112233)
const { loading, loadingData } = useLoadingData()
const isInit = ref(false)

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
    listKey.value++
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

const toggleAll = loadingData(() => {
  if (isAllSelected.value) {
    selectedIds.value = new Set<DATA[ID_KEY]>()
  } else {
    selectedIds.value = new Set<DATA[ID_KEY]>(allOptions.value.map((item) => item[props.idKey]))
  }
  triggerRef(selectedIds)
})
</script>

<template>
  <div class="virtual-select-dialog">
    <el-dialog
      :title="title"
      v-model="visible"
      style="width: fit-content; height: 88vh"
      :style="{
        width: hasVerticalScrollbar ? `calc( ${itemWidth}px + var(--app-scrollbar-width, 8px))` : `${itemWidth}px`,
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
            <RecycleScroller
              ref="refRecycleScroller"
              class="option-list"
              :key="listKey"
              :items="allOptions"
              :item-size="itemHeight"
              :key-field="idKey as string"
              v-slot="{ item, index }: { item: DATA; index: number }"
              :style="{ paddingRight: hasVerticalScrollbar ? 'var(--app-scrollbar-width, 8px)' : '0' }"
            >
              <slot name="item" :item="item" :index="index">
                <div
                  class="option-item table-row"
                  :style="{
                    height: `${typeof itemHeight === 'function' ? itemHeight(item) : itemHeight}px`,
                    lineHeight: `${typeof itemHeight === 'function' ? itemHeight(item) : itemHeight}px`,
                    width: `${itemWidth}px`,
                  }"
                  :class="isItemSelected(item) ? 'selected' : ''"
                  @click="handleItemClick(item)"
                >
                  <slot name="prefix-icon" :selected="isItemSelected(item)">
                    <span class="select-icon" :class="multiple ? 'checkbox' : 'radio'"></span>
                  </slot>
                  <span class="option-item-label">
                    <slot name="item-label" :item="item" :index="index">
                      <AppTooltip :content="getDataLabel(item)" />
                    </slot>
                  </span>
                </div>
              </slot>
            </RecycleScroller>
          </slot>
        </div>
        <div class="current-selection">
          <span v-if="multiple">已选择（{{ selectedIds.size }}）</span>
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
