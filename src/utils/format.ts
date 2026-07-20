import { formatFileSizeFromKB } from '@ybgnb/utils'

export const formatBytes = (bytes: number) => {
  return formatFileSizeFromKB(bytes / 1024)
}

export const formatSpeed = (speedKBps: number) => {
  if (speedKBps === 0) return '0 KB/s'
  if (speedKBps < 1024) return speedKBps.toFixed(1) + ' KB/s'
  return (speedKBps / 1024).toFixed(1) + ' MB/s'
}

export const formatStatCount = (viewCount: number) => {
  if (viewCount <= 10000) return String(viewCount)

  return (viewCount / 10000).toFixed(1) + '万'
}
