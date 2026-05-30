import { shallowRef, toValue, ref, watch, type MaybeRefOrGetter } from 'vue'

export const useSelectData = <Data, ID>(dataList: MaybeRefOrGetter<Data[]>, getId: (data: Data) => ID) => {
  const selectedIds = shallowRef<ID[]>([])

  function isSelected(id: ID) {
    return selectedIds.value.includes(id)
  }

  function toggleSelect(id: ID) {
    const index = selectedIds.value.indexOf(id)
    if (index > -1) {
      selectedIds.value = selectedIds.value.splice(index, 1)
    } else {
      selectedIds.value = [...selectedIds.value, id]
    }
  }

  const isAllSelected = ref(false)

  watch(
    selectedIds,
    () => {
      const list = toValue(dataList)
      isAllSelected.value =
        list.length > 0 &&
        list.every((item) => {
          return selectedIds.value.includes(getId(item))
        })
    },
    { immediate: true },
  )

  function toggleAll() {
    if (isAllSelected.value) {
      const ids = toValue(dataList).map((item) => getId(item))
      selectedIds.value = ids
    } else {
      selectedIds.value = []
    }
  }

  function getSelectedData() {
    return toValue(dataList).filter((data) => selectedIds.value.includes(getId(data)))
  }

  return {
    selectedIds,
    isSelected,
    toggleSelect,
    isAllSelected,
    toggleAll,
    getSelectedData,
  }
}
