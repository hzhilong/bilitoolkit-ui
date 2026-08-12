import type { Resolver } from '@ybgnb/utils'

export interface SelectDialogProps<T = unknown> {
  title?: string
  options: T[] | (() => Promise<T[]>)
  defaultSelectedList?: T[]
  getDataLabel: (data: T) => string
  getDataId: (data: T) => string | number
  //  isDisabled?: (data: T) => boolean
  multiple?: boolean
  canSelectAll?: boolean
  showCurrentSelection?: boolean
  confirmText?: string
  cancelText?: string
  noSelectionTip?: string
}

export interface VirtualSelectDialogProps<DATA = unknown, ID_KEY extends keyof DATA = keyof DATA> {
  title?: string
  options: Resolver<DATA[]>
  defaultSelectedIds?: Resolver<DATA[ID_KEY][]>
  getDataLabel: (data: DATA) => string
  idKey: ID_KEY
  multiple?: boolean
  canSelectAll?: boolean
  confirmText?: string
  cancelText?: string
  noSelectionTip?: string
  itemHeight?: number | ((data: DATA) => number)
  itemWidth?: number
}
