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
  console.log('[BreezeAdmin] VITE_ENABLE_MOCK =', import.meta.env.VITE_ENABLE_MOCK)
  console.log('[BreezeAdmin] VITE_SERVICE_BASE_URL =', import.meta.env.VITE_SERVICE_BASE_URL)

  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  const app = createApp(App)

  // 根据环境变量决定是否启动 MSW Mock 服务
  if (import.meta.env.VITE_ENABLE_MOCK === 'true') {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
      quiet: true,
    })

    // 页面从后台恢复时，重启 MSW 以确保 service worker 仍然活跃
    // 浏览器可能终止后台页面的 SW 进程，直接 worker.start() 会被 MSW 视为
    // 冗余调用而跳过，必须先 stop 再 start 强制重新注册
    document.addEventListener('visibilitychange', async () => {
      if (!document.hidden) {
        try {
          await worker.stop()
        } catch { /* worker 可能已被浏览器终止，忽略 */ }
        await worker.start({
          onUnhandledRequest: 'bypass',
          quiet: true,
        })
      }
    })
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
