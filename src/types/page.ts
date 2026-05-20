export type PageParams = {
  pageSize: number
  pageNum: number
}

export interface PageData {
  pageNum: number
  pageSize: number
  totalPages: number
  total: number
}

export interface PageResult<D> extends PageData {
  data: D[]
}

export type FetchPage<D, Q = undefined> = Q extends undefined
  ? (pageParams: PageParams) => Promise<PageResult<D>>
  : (pageParams: PageParams, queryParams: Q) => Promise<PageResult<D>>
