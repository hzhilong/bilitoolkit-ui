import type { FetchPage, PageParams } from '@/types/page'

export type PageTableAction = 'search' | 'resetQuery'
export type SelectionMode = 'none' | 'single' | 'multiple'

export type PageTableProps<D, Q = undefined> = {
  /**
   * 自动加载数据
   * @default true
   */
  autoLoad?: boolean
  /** 搜索按钮的文本 */
  searchActionLabel?: string
  /** 顶部栏按钮 */
  actions?: PageTableAction[]
  /** 获取分页数据的方法 */
  fetchPage: FetchPage<D, Q>
  /** 分页参数 */
  pageParams?: PageParams
  /** 查询参数 */
  queryParams?: Q
  /** 分页大小切换选项 */
  pageSizes: number[]
  /** 表格选择行为模式 */
  selectionMode?: SelectionMode
  /** 表格高度，为空则占据页面最大可用高度 */
  tableHeight?: number | string
  /** 设置表格单元、行和列的布局方式 */
  tableLayout?: 'auto' | 'fixed'
}
