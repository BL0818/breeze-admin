import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { authGuard } from './guards'
import { useProgress } from '@/composables/use-progress'

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

export default router
