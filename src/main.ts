import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import { i18n } from './locales'
import { useAuthStore } from './stores/auth'
import './styles/globals.css'

async function bootstrap() {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  const app = createApp(App)

  // 仅在开发环境启动 MSW
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
    })
  }

  // 关键：在路由使用之前初始化 store，确保 pinia-plugin-persistedstate 已恢复数据
  app.use(pinia)
  // pinia-plugin-persistedstate 会在 store 首次访问时自动恢复数据，初始化 store 触发恢复
  useAuthStore() // eslint-disable-line @typescript-eslint/no-unused-expressions

  app.use(router)
  app.use(i18n)

  app.mount('#app')
}

bootstrap()
