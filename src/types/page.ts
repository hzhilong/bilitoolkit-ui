export type Data = Record<string, unknown>

export type PageBaseParams = {
  pageSize: number
  pageNum: number
}

export type PageParams<C = Data> = Omit<Partial<C>, keyof PageBaseParams> & PageBaseParams

export type ResetPageParams<C = Data> = Omit<PageParams<C>, keyof PageBaseParams>

export interface PageData {
  pageNum: number
  pageSize: number
  totalPages: number
  total: number
}

export interface PageResult<C> extends PageData {
  data: C[]
}

export type GetPage<D> = (pageParams: PageParams<D>) => Promise<PageResult<D>>
