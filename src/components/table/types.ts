export interface PageTableProps<D, Q extends QueryParams = QueryParams> {
  /** 获取分页数据的方法 */
  getPage: GetPage<D, Q>
  /** 查询参数 */
  params: RestPageParams<Q>
  /**
   * 自动加载数据
   * @default true
   */
  autoLoad?: boolean
}

export interface PageTableExpose<D> {
  loading: Ref<boolean>
  tableData: Ref<D[]>
  pageData: Ref<PageData>
  refresh: () => Promise<void>
  resetAndRefresh: () => Promise<void>
}
