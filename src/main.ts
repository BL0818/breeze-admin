import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import { i18n } from './locales'
import { useAuthStore } from './stores/auth'
import './styles/globals.css'

async function bootstrap() {
  // Debug: 验证 env 变量是否正确注入
  const mockFlag = import.meta.env.VITE_ENABLE_MOCK
  console.log('[BreezeAdmin] VITE_ENABLE_MOCK =', mockFlag, typeof mockFlag)
  console.log('[BreezeAdmin] VITE_SERVICE_BASE_URL =', import.meta.env.VITE_SERVICE_BASE_URL)

  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  const app = createApp(App)

  // 根据环境变量决定是否启动 MSW Mock 服务
  // Vercel 可能注入 boolean 而非 string，用宽松比较兼容两种情况
  const enableMock = String(import.meta.env.VITE_ENABLE_MOCK) === 'true'
  if (enableMock) {
    console.log('[BreezeAdmin] MSW: 开始初始化...')
    try {
      const { worker } = await import('./mocks/browser')
      console.log('[BreezeAdmin] MSW: browser 模块已加载', worker)
      await worker.start({
        onUnhandledRequest: 'bypass',
      })
      console.log('[BreezeAdmin] MSW: Service Worker 已启动')
    } catch (e) {
      console.error('[BreezeAdmin] MSW: 初始化失败', e)
    }
  }

  // 关键：在路由使用之前初始化 store，确保 pinia-plugin-persistedstate 已恢复数据
  app.use(pinia)
  // pinia-plugin-persistedstate 会在 store 首次访问时自动恢复数据，初始化 store 触发恢复
  useAuthStore()  

  app.use(router)
  app.use(i18n)

  app.mount('#app')
}

bootstrap()
