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
  hasComponent?: boolean
}

/**
 * 构建扁平化路由 Map - O(1) 查找
 * key: 完整路径，如 /dashboard, /system/settings, /system/permissions/roles
 */
function buildRoutePathMap(routes: AppRouteConfig[], parentPath = ''): Map<string, AppRouteConfig> {
  const pathMap = new Map<string, AppRouteConfig>()

  for (const route of routes) {
    // 跳过隐藏路由
    if (route.meta?.hidden) {
      continue
    }

    // 处理空路径：映射为父路径（如 Dashboard path='' → parentPath='/'）
    const fullPath = route.path === ''
      ? (parentPath || '/')
      : (parentPath ? `${parentPath}/${route.path}` : `/${route.path}`)

    // 有 children 时递归处理
    if (route.children && route.children.length > 0) {
      // 非 redirect-only 路由记录自身（面包屑需要父级）
      if (!route.redirect || route.component || route.meta?.title) {
        pathMap.set(fullPath, route)
      }

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
    hidden: route.meta?.hidden ?? false,
    hasComponent: !!route.component
  }
}

/**
 * 根据路径构建面包屑（带缓存查找）
 * 注意：title 是原始的 i18n key，回退到 segment 名称
 */
export function buildBreadcrumbs(
  path: string
): { path: string; title: string; icon: IconName; hasComponent: boolean }[] {
  // 根路径直接查找
  if (path === '/') {
    const meta = getRouteMeta('/')
    if (meta && !meta.hidden) {
      return [{
        path: '/',
        title: meta.title ?? 'Home',
        icon: meta.icon ?? 'LayoutDashboard',
        hasComponent: meta.hasComponent ?? true
      }]
    }
    return []
  }

  const segments = path.split('/').filter(Boolean)
  const items: { path: string; title: string; icon: IconName; hasComponent: boolean }[] = []
  let currentPath = ''

  for (const segment of segments) {
    currentPath += '/' + segment
    const meta = getRouteMeta(currentPath)

    if (meta && !meta.hidden) {
      items.push({
        path: currentPath,
        title: meta.title ?? segment,
        icon: meta.icon ?? 'LayoutDashboard',
        hasComponent: meta.hasComponent ?? true
      })
    }
  }

  return items
}
