import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { hasPermission } from './permissions'

export const authGuard = (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  // 1. 认证检查
  if (to.meta.requiresAuth !== false) {
    if (!authStore.isAuthenticated) {
      next('/login')
      return
    }

    // 2. 角色权限检查
    const roles = to.meta.roles as string[] | undefined
    if (!hasPermission(roles, authStore.user?.role)) {
      next('/')
      return
    }
  }

  // 3. 已登录访问登录页 -> 重定向
  if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
    return
  }

  next()
}
