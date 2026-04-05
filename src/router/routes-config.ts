import type { AppRouteConfig } from './types'

// ==================== 静态路由配置 ====================
// 完整路由配置 - 单一数据源，同时支撑路由注册与菜单渲染

export const ROUTES_META: AppRouteConfig[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: {
      title: 'nav.login',
      requiresAuth: false
    }
  },
  {
    path: '/',
    name: 'AppLayout',
    component: () => import('@/components/layout/AppLayout.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),
        meta: {
          title: 'nav.dashboard',
          icon: 'LayoutDashboard',
          affix: true
        }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/orders/Orders.vue'),
        meta: {
          title: 'nav.orders',
          icon: 'ShoppingCart',
          roles: ['admin', 'manager']
        }
      },
      {
        path: 'complex-form',
        name: 'ComplexForm',
        component: () => import('@/views/form/ComplexForm.vue'),
        meta: {
          title: 'nav.complexForm',
          icon: 'FormInput'
        }
      },
      {
        path: 'query-table',
        name: 'QueryTable',
        component: () => import('@/views/query/QueryTable.vue'),
        meta: {
          title: 'nav.queryTable',
          icon: 'Search'
        }
      },
      // ==================== 多级菜单示例 ====================
      {
        path: 'menu-level',
        name: 'MenuLevel',
        redirect: '/menu-level/level2/level3',
        meta: {
          title: 'nav.menuLevel1',
          icon: 'Layers',
        },
        children: [
          {
            path: 'level2',
            name: 'MenuLevel2',
            redirect: '/menu-level/level2/level3',
            meta: {
              title: 'nav.menuLevel2',
              icon: 'FolderTree',
            },
            children: [
              {
                path: 'level3',
                name: 'MenuLevel3',
                component: () => import('@/views/menu-level/Level3.vue'),
                meta: {
                  title: 'nav.menuLevel3',
                  icon: 'File',
                }
              }
            ]
          }
        ]
      },
      // ==================== 系统功能 ====================
      {
        path: 'system',
        name: 'System',
        redirect: '/system/requests',
        meta: {
          title: 'nav.system',
          icon: 'Settings',
        },
        children: [
          {
            path: 'requests',
            name: 'RequestManagement',
            component: () => import('@/views/system/RequestManagement.vue'),
            meta: {
              title: 'nav.requestManagement',
              icon: 'FileText',
            }
          },
          {
            path: 'permissions',
            name: 'SwitchPermissions',
            component: () => import('@/views/system/SwitchPermissions.vue'),
            meta: {
              title: 'nav.switchPermissions',
              icon: 'ShieldCheck',
            }
          },
          {
            path: 'super-admin',
            name: 'SuperAdmin',
            component: () => import('@/views/system/SuperAdmin.vue'),
            meta: {
              title: 'nav.superAdmin',
              icon: 'Crown',
              roles: ['admin']
            }
          },
          {
            path: 'request-examples',
            name: 'RequestExamples',
            component: () => import('@/views/system/RequestExamples.vue'),
            meta: {
              title: 'nav.requestExamples',
              icon: 'Code',
            }
          }
        ]
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/Error404.vue'),
    meta: {
      requiresAuth: false
    }
  }
]

// ==================== 动态路由配置（保持向后兼容） ====================

export const DYNAMIC_ROUTES_META: AppRouteConfig[] = []

/**
 * 合并动态路由（供后端菜单数据接入使用）
 */
export function mergeDynamicRoutes(routes: AppRouteConfig[]) {
  DYNAMIC_ROUTES_META.push(...routes)
}
