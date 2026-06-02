export interface PageRangeDialogProps {
  title?: string
  defaultRange?: [number, number]
  total?: number
  minPage?: number
  maxPage?: number
  pageSize: number
  confirmText?: string
  cancelText?: string
}
