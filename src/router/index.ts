import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { authGuard } from './guards'
import { useProgress } from '@/composables/use-progress'
import { i18n } from '@/locales'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(authGuard)

// 进度条钩子 — 仅在路径真正变化时触发
const { start, finish } = useProgress()
router.beforeEach((to, from) => {
  if (to.path !== from.path) start()
})
router.afterEach(() => finish())

// 页面标题统一设置 — 覆盖所有页面（含登录页等非布局页面）
router.afterEach((to) => {
  const titleKey = to.meta.title as string | undefined
  const appTitle = import.meta.env.VITE_APP_TITLE || 'BreezeAdmin'
  const t = i18n.global.t
  document.title = titleKey ? `${t(titleKey)} - ${appTitle}` : appTitle
})

export default router
