import { alovaInstance } from '@/utils/request'
import type { RequestLog, RolePermission, SystemInfo, AdminUser } from '@/types/api-schema'

export const systemApi = {
  /** 获取请求日志列表 */
  getRequestLogs: () => {
    return alovaInstance.Get<RequestLog[]>('/api/system/request-logs')
  },

  /** 获取角色权限列表 */
  getPermissions: () => {
    return alovaInstance.Get<RolePermission[]>('/api/system/permissions')
  },

  /** 获取系统信息 */
  getAdminInfo: () => {
    return alovaInstance.Get<SystemInfo>('/api/system/admin-info')
  },

  /** 获取管理员列表 */
  getAdminUsers: () => {
    return alovaInstance.Get<AdminUser[]>('/api/system/admin-users')
  },
}
