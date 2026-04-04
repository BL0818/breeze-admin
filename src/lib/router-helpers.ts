import type { AppRouteConfig } from '@/router/types'
import { ROUTES_META } from '@/router/routes-config'
import type { IconName } from './icon-map'

/**
 * 路由元信息接口
 */
export interface RouteMetaInfo {
  path: string
  title?: string
  icon?: IconName
  hidden?: boolean
}

/**
 * 构建扁平化路由 Map - O(1) 查找
 * key: 完整路径，如 /dashboard, /system/settings, /system/permissions/roles
 */
function buildRoutePathMap(routes: AppRouteConfig[], parentPath = ''): Map<string, AppRouteConfig> {
  const pathMap = new Map<string, AppRouteConfig>()

  for (const route of routes) {
    // 跳过空路径和隐藏路由
    if (!route.path || route.meta?.hidden) {
      continue
    }

    // 构建完整路径，确保带前导斜杠
    const fullPath = parentPath
      ? `${parentPath}/${route.path}`
      : `/${route.path}`

    // 只存储完整路径（叶子节点）的 meta
    // 如果有 children，继续递归
    if (route.children && route.children.length > 0) {
      // 如果有 redirect 且没有 exact match，用 redirect 的路径
      if (route.redirect && !route.component) {
        // redirect 路由不直接加入 map，让子路由来处理
      } else {
        // 非 redirect 路由，记录自己
        pathMap.set(fullPath, route)
      }

      // 递归处理子路由
      const childMap = buildRoutePathMap(route.children, fullPath)
      childMap.forEach((config, path) => {
        pathMap.set(path, config)
      })
    } else {
      // 叶子节点
      pathMap.set(fullPath, route)
    }
  }

  return pathMap
}

// 单例缓存 - 路由配置通常在应用生命周期内不变
let routePathMapCache: Map<string, AppRouteConfig> | null = null

/**
 * 获取路由路径 Map（带缓存）
 */
export function getRoutePathMap(): Map<string, AppRouteConfig> {
  if (!routePathMapCache) {
    // 从 ROUTES_META 中提取子路由
    const layoutRoute = ROUTES_META.find(r => r.path === '/')
    routePathMapCache = buildRoutePathMap(layoutRoute?.children || [])
  }
  return routePathMapCache
}

/**
 * 根据路径获取路由元信息
 */
export function getRouteMeta(path: string): RouteMetaInfo | null {
  const pathMap = getRoutePathMap()

  // 直接 O(1) 查找
  const route = pathMap.get(path)

  if (!route) return null

  return {
    path,
    title: route.meta?.title as string | undefined,
    icon: route.meta?.icon as IconName | undefined,
    hidden: route.meta?.hidden ?? false
  }
}

/**
 * 根据路径构建面包屑（带缓存查找）
 * 注意：title 是原始的 i18n key，回退到 segment 名称
 */
export function buildBreadcrumbs(
  path: string
): { path: string; title: string; icon: IconName }[] {
  const segments = path.split('/').filter(Boolean)
  const items: { path: string; title: string; icon: IconName }[] = []
  let currentPath = ''

  for (const segment of segments) {
    currentPath += '/' + segment
    const meta = getRouteMeta(currentPath)

    if (meta && !meta.hidden) {
      items.push({
        path: currentPath,
        title: meta.title ?? segment,
        icon: meta.icon ?? 'LayoutDashboard'
      })
    }
  }

  return items
}
