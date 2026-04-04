/**
 * Auth Store
 *
 * - pinia-plugin-persistedstate 自动持久化 token / user / tokenExpiry
 * - 禁止手动 localStorage 调用（双重持久化已修复）
 * - User 类型来自统一 Schema
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/api-schema'

const TOKEN_EXPIRY_DAYS = 7

export const useAuthStore = defineStore('auth', () => {
  // ======================== State ========================
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)
  const tokenExpiry = ref<number | null>(null)

  // ======================== Computed ========================
  const isAuthenticated = computed(() => {
    if (!token.value) return false
    if (!tokenExpiry.value) return true
    return Date.now() < tokenExpiry.value
  })

  const isAdmin = computed(() => user.value?.role === 'admin')

  // ======================== Actions ========================

  /** 登录成功后调用，写入 token 和用户信息 */
  function setAuth(data: { token: string; user: User }, remember = false) {
    token.value = data.token
    user.value = data.user
    if (remember) {
      tokenExpiry.value = Date.now() + TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    } else {
      tokenExpiry.value = null
    }
    // 无手动 localStorage 调用 — pinia-plugin-persistedstate 自动持久化
  }

  /** 退出登录，清除全部认证状态 */
  function logout() {
    token.value = null
    user.value = null
    tokenExpiry.value = null
    // 无手动 localStorage 调用 — pinia-plugin-persistedstate 自动清除
  }

  /** 仅重置 token（用于 token 过期但保留用户信息场景） */
  function resetToken() {
    token.value = null
    tokenExpiry.value = null
  }

  return {
    token,
    user,
    tokenExpiry,
    isAuthenticated,
    isAdmin,
    setAuth,
    logout,
    resetToken,
  }
}, {
  persist: {
    key: 'auth',
    storage: localStorage,
    paths: ['token', 'user', 'tokenExpiry'],
  },
})
