import type { RouteRecordRaw } from 'vue-router'
import type { Component } from 'vue'

/**
 * 路由元信息扩展
 */
export interface AppRouteMeta {
  /** i18n key, e.g. 'nav.dashboard' */
  title?: string
  /** Lucide icon name */
  icon?: string
  /** Allowed roles for access control */
  roles?: string[]
  /** Hide from sidebar menu */
  hidden?: boolean
  /** Auth required (default: true) */
  requiresAuth?: boolean
  /** Pin in tabs */
  affix?: boolean
  /** Keep component alive in memory */
  keepAlive?: boolean
  /** Explicit active menu path (for nested routes) */
  activeMenu?: string
  /** Index signature for compatibility with RouteMeta */
  [key: string]: unknown
}

/**
 * 完整路由配置 - 单一数据源
 */
export interface AppRouteConfig {
  path: string
  name?: string
  /** 布局组件或页面组件 */
  component?: () => Promise<Component>
  /** 重定向目标 */
  redirect?: string
  meta: AppRouteMeta
  children?: AppRouteConfig[]
}

/**
 * 菜单项结构（供 Sidebar 使用）
 */
export interface MenuItem {
  path: string
  name: string
  icon?: Component
  children?: MenuItem[]
}

/**
 * 转换后的 Vue Router 记录
 */
export type AppRouteRecord = RouteRecordRaw & {
  meta: AppRouteMeta
}
