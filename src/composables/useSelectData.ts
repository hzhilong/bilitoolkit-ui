import { computed, type Ref, shallowRef, toValue } from 'vue'

export const useSelectData = <Data, ID>(dataList: Ref<Data[]>, getId: (data: Data) => ID) => {

  const selectedIds = shallowRef<Set<ID>>(new Set<ID>([]))

  const checkboxValue = computed({
    get() {
      return [...selectedIds.value]
    },

    set(value: ID[]) {
      selectedIds.value = new Set(value)
    },
  })

  /**
   * 是否选中
   */
  function isSelected(id: ID) {
    return selectedIds.value.has(id)
  }

  /**
   * 切换选择
   */
  function toggleSelect(id: ID) {
    const set = new Set<ID>(selectedIds.value)

    if (set.has(id)) {
      set.delete(id)
    } else {
      set.add(id)
    }

    selectedIds.value = set
  }

  /**
   * 全选
   */
  const isAllSelected = computed(() => {
    const list = toValue(dataList)
    return list.length > 0 && list.every((item) => selectedIds.value.has(getId(item)))
  })

  /**
   * 切换全选
   */
  function toggleAll() {
    if (isAllSelected.value) {
      selectedIds.value = new Set<ID>()
      return
    }
    const list = toValue(dataList)
    selectedIds.value = new Set<ID>(list.map((item) => getId(item)))
  }

  function getSelectedData() {
    return toValue(dataList).filter((data) => selectedIds.value.has(getId(data)))
  }

  return {
    selectedIds,
    isSelected,
    toggleSelect,
    isAllSelected,
    toggleAll,
    getSelectedData,
    checkboxValue,
  }
}
