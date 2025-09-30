import type { BiliAccountInfo } from 'bilitoolkit-api-types'
import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import cloneDeep from 'lodash-es/cloneDeep'
import { useTestDataStore } from '@/stores/test-data.ts'

/**
 * 选择的账号状态 Store
 */
export const useSelectedAccountStore = defineStore('BiliToolkit-ui-SelectedAccountStore', () => {
  const state = reactive<{
    selectedAccount: BiliAccountInfo | undefined
  }>({
    selectedAccount: undefined,
  })

  const { state: testDataState } = useTestDataStore()

  // 初始化
  const init = async () => {
    try {
      if (testDataState.isTest) {
        state.selectedAccount = testDataState.account
        return
      }
      const newState = await window.toolkitApi.db.read<BiliAccountInfo>('ui-selected-account')
      if (newState) {
        state.selectedAccount = newState
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_: unknown) {}
  }

  watch(
    state,
    async (newState) => {
      if (newState.selectedAccount && !testDataState.isTest) {
        await window.toolkitApi.db.write('ui-selected-account', cloneDeep(newState.selectedAccount!))
      }
    },
    { deep: true },
  )

  const deleteAccount = () => {
    state.selectedAccount = undefined
  }

  const setAccount = (account: BiliAccountInfo) => {
    state.selectedAccount = account
  }

  return { init, state, deleteAccount, setAccount }
})
