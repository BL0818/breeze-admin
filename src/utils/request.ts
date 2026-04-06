/**
 * 企业级 Alova 实例封装
 *
 * - 请求拦截：自动注入 Authorization + Content-Type
 * - 响应拦截：HTTP 状态 → 业务码检查 → 自动解包 data.data → 401 登出
 * - BusinessError 类供业务 catch 块判断
 *
 * 此文件不依赖任何业务模块，避免循环依赖。
 */
import { createAlova } from 'alova'
import VueHook from 'alova/vue'
import GlobalFetch from 'alova/GlobalFetch'

// ======================== BusinessError ========================

export class BusinessError extends Error {
  code: number
  constructor(code: number, message: string) {
    super(message)
    this.name = 'BusinessError'
    this.code = code
  }
}

// ======================== Token 读取 ========================

/**
 * 从 pinia-plugin-persistedstate 持久化的 localStorage 中读取 token。
 * 直接解析 JSON，不 import auth store，避免循环依赖。
 */
function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem('auth')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.token ?? null
  } catch {
    return null
  }
}

// ======================== 401 处理 ========================

let isRedirecting = false

function handle401(): void {
  if (isRedirecting) return
  isRedirecting = true
  // 动态导入，避免循环依赖
  import('@/stores/auth').then(({ useAuthStore }) => {
    const authStore = useAuthStore()
    authStore.logout()
    window.location.href = '/login'
  }).finally(() => {
    setTimeout(() => { isRedirecting = false }, 1000)
  })
}

// ======================== Alova 实例 ========================

// Mock 启用时 baseURL 置空，请求走相对路径，由 MSW 拦截，避免跨域问题
const enableMock = String(import.meta.env.VITE_ENABLE_MOCK).trim() === 'true'

export const alovaInstance = createAlova({
  baseURL: enableMock ? '' : import.meta.env.VITE_SERVICE_BASE_URL,
  statesHook: VueHook,
  timeout: 30000,
  requestAdapter: GlobalFetch(),

  beforeRequest(method) {
    // Token 注入
    const token = getAuthToken()
    if (token) {
      method.config.headers.Authorization = `Bearer ${token}`
    }
    // POST/PUT/PATCH 自动注入 Content-Type
    if (['POST', 'PUT', 'PATCH'].includes(method.type)) {
      if (!method.config.headers['Content-Type']) {
        method.config.headers['Content-Type'] = 'application/json'
      }
    }
  },

  responded: (response: Response) => {
    // Step 1: HTTP 状态检查
    if (!response.ok) {
      if (response.status === 401) {
        handle401()
      }
      throw new Error(`Request failed with status ${response.status}`)
    }

    // Step 2: 解析 JSON + 业务码检查 + 解包
    return response.json().then((json: { code: number; message?: string; data: unknown }) => {
      if (json.code !== 200) {
        throw new BusinessError(json.code, json.message || 'Business error')
      }
      // 自动解包：业务组件直接拿到 data
      return json.data
    })
  },
})
