import type { RouteRecordRaw } from 'vue-router'
import { ROUTES_META, DYNAMIC_ROUTES_META } from './routes-config'
import type { AppRouteConfig } from './types'

/**
 * 将 AppRouteConfig 递归转换为 Vue Router 格式
 */
function generateRoute(config: AppRouteConfig, prefix = ''): RouteRecordRaw {
  const fullPath = prefix ? `${prefix}/${config.path}` : config.path

  const route = {
    path: fullPath,
    name: config.name,
    component: config.component,
    meta: config.meta
  } as RouteRecordRaw

  if (config.children && config.children.length > 0) {
    // children 的 path 保持相对，不要加前缀
    route.children = config.children.map(child => generateRoute(child, ''))
  }

  return route
}

/**
 * 生成完整路由数组
 */
const routes: RouteRecordRaw[] = [
  ...(ROUTES_META as AppRouteConfig[]).map(route => generateRoute(route)),
  ...(DYNAMIC_ROUTES_META as AppRouteConfig[]).map(route => generateRoute(route))
]

export default routes
