import { alovaInstance } from '@/utils/request'
import type { LoginData, User } from '@/types/api-schema'

export const authApi = {
  /** 登录 — 返回解包后的 { token, user } */
  login: (username: string, password: string) => {
    return alovaInstance.Post<LoginData>('/api/auth/login', { username, password })
  },

  /** 获取当前用户信息 — 返回解包后的 User */
  getUserInfo: () => {
    return alovaInstance.Get<User>('/api/auth/userinfo')
  },

  /** 忘记密码 — 无返回数据 */
  forgotPassword: (email: string) => {
    return alovaInstance.Post<void>('/api/auth/forgot-password', { email })
  },
}
