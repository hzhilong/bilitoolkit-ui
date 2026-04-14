import type { PluginMenuData } from '@/components/plugin/types.ts'

export const testMenus: PluginMenuData[] = [
  {
    title: '备份数据',
    path: '/home',
  },
  {
    title: '还原数据',
    path: '/market',
  },
  {
    title: '插件设置',
    path: '/manage',
  },
] as const
