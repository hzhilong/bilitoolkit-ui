export interface PluginMenuInfo {
  title: string
  path: string
  children?: Array<PluginMenuInfo>
}

export interface PluginMenusProps {
  menus: Array<PluginMenuInfo>
  activeIndex: string
}

export interface PluginMenuItemProps {
  menu: PluginMenuInfo
}
