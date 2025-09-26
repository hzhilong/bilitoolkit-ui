import type { BiliAccountInfo } from 'bilitoolkit-api-types'

/**
 * 账号卡片信息
 */
export interface BiliAccountCardProps {
  account: BiliAccountInfo
  // 显示注销按钮
  showLogoutBtn?: boolean
}
