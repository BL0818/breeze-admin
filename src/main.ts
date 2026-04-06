import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import { i18n } from './locales'
import { useAuthStore } from './stores/auth'
import './styles/globals.css'

// 开发环境过滤第三方库的推广信息
if (import.meta.env.DEV) {
  const originalLog = console.log
  console.log = (...args: unknown[]) => {
    const msg = args.join('')
    if (msg.includes('powerful alova') || msg.includes('please star alova') || msg.includes('use mock data:')) {
      return
    }
    originalLog.apply(console, args)
  }
}

async function bootstrap() {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  const app = createApp(App)

  // 根据环境变量决定是否启动 MSW Mock 服务
  const enableMock = String(import.meta.env.VITE_ENABLE_MOCK).trim() === 'true'
  if (enableMock) {
    try {
      const { worker } = await import('./mocks/browser')
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
      })
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
