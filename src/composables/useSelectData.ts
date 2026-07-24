import { computed, shallowRef, toValue, type MaybeRefOrGetter } from 'vue'

export const useSelectData = <Data, ID>(
  dataList: MaybeRefOrGetter<Data[]>,
  getId: (data: Data) => ID,
  defaultList: ID[] = [],
) => {
  const selectedIds = shallowRef<ID[]>([...defaultList])

  function isSelected(data: Data) {
    return selectedIds.value.includes(getId(data))
  }

  function toggleSelect(data: Data) {
    const id = getId(data)
    if (isSelected(data)) {
      selectedIds.value = selectedIds.value.filter((item) => item !== id)
    } else {
      selectedIds.value = [...selectedIds.value, id]
    }
  }

  const isAllSelected = computed(() => {
    const list = toValue(dataList)
    return list.length > 0 && list.every((item) => selectedIds.value.includes(getId(item)))
  })

  function toggleAll() {
    if (isAllSelected.value) {
      selectedIds.value = []
    } else {
      selectedIds.value = toValue(dataList).map(getId)
    }
  }

  function getSelectedData() {
    return toValue(dataList).filter((data) => selectedIds.value.includes(getId(data)))
  }

  function cleanupSelected() {
    const validIds = new Set(toValue(dataList).map(getId))
    selectedIds.value = selectedIds.value.filter((id) => validIds.has(id))
  }

  function clearSelected() {
    selectedIds.value = []
  }

  function select(ids: ID[]) {
    selectedIds.value = [...ids]
  }

  return {
    selectedIds,

    isSelected,
    toggleSelect,

    isAllSelected,
    toggleAll,

    getSelectedData,

    cleanupSelected,
    clearSelected,
    select,
  }
}
