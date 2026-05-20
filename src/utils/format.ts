/**
 * 格式化时间戳。可自动判断 10/13 位时间戳
 * @param timestamp
 */
export function formatTime(timestamp: number | string | Date | undefined): string {
  if (typeof timestamp === 'undefined') return ''
  if (timestamp instanceof Date) {
    return timestamp.toLocaleString()
  } else {
    const num = typeof timestamp === 'string' ? Number(timestamp) : timestamp
    if (isNaN(num)) return ''

    return new Date(num < 1e12 ? num * 1000 : num).toLocaleString()
  }
}
