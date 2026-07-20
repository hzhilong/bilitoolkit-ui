import type { DownloadTask } from 'bilitoolkit-types'
import { toolkitApi } from '@/api/toolkit-api'
import { showDeleteConfirmDialog } from '@/components/download/deleteConfirmService.js'
import { showToast } from '@/utils/feedback'

export const handleOpenFolder = async (task: DownloadTask): Promise<void> => {
  await toolkitApi.system.showItemInFolder(
    [await toolkitApi.file.getRootDir(), task.videos[0].parts[0].subdirectory]
      .filter(Boolean)
      .join('/')
      .replace(/\/+/g, '/'),
  )
}

export const handlePause = async (task: DownloadTask): Promise<void> => {
  await toolkitApi.download.pause(task.id)
  showToast('暂停任务成功')
}

export const handleResume = async (task: DownloadTask): Promise<void> => {
  await toolkitApi.download.resume(task.id)
  showToast('正在继续下载')
}

export const handleCancel = async (task: DownloadTask): Promise<void> => {
  await toolkitApi.download.cancel(task.id)
  showToast('取消任务成功')
}

export const handleDelete = async (task: DownloadTask): Promise<void> => {
  const { deleteSourceFile } = await showDeleteConfirmDialog({
    message: '确定删除该下载任务吗？',
  })

  await toolkitApi.download.remove(task.id, {
    deleteFiles: deleteSourceFile,
  })
}
