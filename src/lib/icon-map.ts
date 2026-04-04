import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  FormInput,
  Settings,
  Settings2,
  Shield,
  UserCog,
  Menu,
  Home,
  type Component
} from 'lucide-vue-next'

// 图标名称类型
export type IconName =
  | 'LayoutDashboard'
  | 'ShoppingCart'
  | 'Users'
  | 'FormInput'
  | 'Settings'
  | 'Settings2'
  | 'Shield'
  | 'UserCog'
  | 'Menu'
  | 'Home'

// Lucide 图标名称到组件的映射
export const iconMap: Record<IconName, Component> = {
  LayoutDashboard,
  ShoppingCart,
  Users,
  FormInput,
  Settings,
  Settings2,
  Shield,
  UserCog,
  Menu,
  Home
}

/**
 * 根据图标名称获取图标组件
 * @param name 图标名称
 * @param fallback 默认图标
 */
export function getIcon(name: string | undefined, fallback: Component = LayoutDashboard): Component {
  if (!name) return fallback
  return iconMap[name as IconName] ?? fallback
}
