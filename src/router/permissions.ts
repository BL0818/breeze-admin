import type { AppRouteConfig, MenuItem } from './types'
import type { Component } from 'vue'
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  FormInput
} from 'lucide-vue-next'

// Icon map - 与 Sidebar 保持一致
const iconMap: Record<string, Component> = {
  LayoutDashboard,
  ShoppingCart,
  Users,
  FormInput
}

/**
 * 判断用户是否有权限访问路由
 */
export function hasPermission(
  roles: string[] | undefined,
  userRole: string | undefined
): boolean {
  if (!roles || roles.length === 0) return true
  if (!userRole) return false
  return roles.includes(userRole)
}

/**
 * 根据权限过滤路由树
 */
export function filterRoutesByPermission(
  routes: AppRouteConfig[],
  userRole: string | undefined
): AppRouteConfig[] {
  return routes
    .filter(route => hasPermission(route.meta.roles, userRole))
    .map(route => {
      if (route.children) {
        return {
          ...route,
          children: filterRoutesByPermission(route.children, userRole)
        }
      }
      return route
    })
}

/**
 * 过滤菜单项（用于侧边栏）
 */
export function filterMenuItems(routes: AppRouteConfig[]): MenuItem[] {
  return routes
    .filter(route => {
      if (!hasPermission(route.meta.roles, undefined)) return false
      if (route.meta.hidden) return false
      if (!route.component) return false
      return true
    })
    .map(route => ({
      path: route.path,
      name: route.meta.title || route.name || route.path,
      icon: route.meta.icon ? iconMap[route.meta.icon] || LayoutDashboard : LayoutDashboard,
      children: route.children ? filterMenuItems(route.children) : undefined
    }))
}

/**
 * 根据角色过滤菜单项
 */
export function filterMenuItemsByRole(
  routes: AppRouteConfig[],
  userRole: string | undefined
): MenuItem[] {
  return routes
    .filter(route => {
      if (!hasPermission(route.meta.roles, userRole)) return false
      if (route.meta.hidden) return false
      if (!route.component) return false
      return true
    })
    .map(route => ({
      path: route.path,
      name: route.meta.title || route.name || route.path,
      icon: route.meta.icon ? iconMap[route.meta.icon] || LayoutDashboard : LayoutDashboard,
      children: route.children ? filterMenuItemsByRole(route.children, userRole) : undefined
    }))
}
