import { alovaInstance } from '@/utils/request'
import type { UserListItem } from '@/types/api-schema'

export const usersApi = {
  /** 获取用户列表 */
  getUsers: () => {
    return alovaInstance.Get<UserListItem[]>('/api/users')
  },
}
