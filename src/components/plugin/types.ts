export interface PluginMenuData {
  title: string
  path: string
  children?: Array<PluginMenuData>
}

export interface PluginMenusProps {
  menus: Array<PluginMenuData>
  activeIndex: string
}

export interface PluginMenuItemProps {
  menu: PluginMenuData
}
