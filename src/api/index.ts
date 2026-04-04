/**
 * API 统一导出
 *
 * 组件统一使用：
 *   import { authApi, dashboardApi } from '@/api'
 *
 * 类型导入红线：
 *   import type { Xxx } from '@/types/api-schema'  ✅
 *   import type { Xxx } from '@/api/...'            ❌
 */
export { authApi } from './modules/auth'
export { dashboardApi } from './modules/dashboard'
export { ordersApi } from './modules/orders'
export { usersApi } from './modules/users'
export { queryApi } from './modules/query'
export { systemApi } from './modules/system'
export { exampleApi } from './modules/example'
