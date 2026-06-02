export interface SelectDialogProps<T = unknown> {
  title?: string
  options: T[] | (() => Promise<T[]>)
  defaultSelectedList?: T[]
  getDataLabel: (data: T) => string
  getDataId: (data: T) => string
  isDisabled?: (data: T) => boolean
  multiple?: boolean
  canSelectAll?: boolean
  showCurrentSelection?: boolean
  confirmText?: string
  cancelText?: string
  noSelectionTip?: string
}
