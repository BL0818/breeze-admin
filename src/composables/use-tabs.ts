import { watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTabsStore } from '@/stores/tabs'
import { ROUTES_META } from '@/router/routes-config'
import type { AppRouteMeta } from '@/router/types'

/**
 * 递归查找所有固定标签的路由
 */
function findAffixRoutes(routes: any[], parentPath = ''): Array<{ path: string; name?: string; meta: AppRouteMeta }> {
  const affixRoutes: Array<{ path: string; name?: string; meta: AppRouteMeta }> = []

  for (const route of routes) {
    // 计算完整路径：父路径 + 子路由路径
    // 子路由 path 如果以 / 开头则是绝对路径，否则相对路径需要拼接
    let fullPath: string
    if (route.path.startsWith('/')) {
      // 绝对路径（如 /login）
      fullPath = route.path
    } else if (parentPath === '/') {
      // 父路径是根路径，直接拼接（避免 //dashboard）
      fullPath = `/${route.path}`
    } else if (parentPath) {
      fullPath = `${parentPath}/${route.path}`
    } else {
      fullPath = route.path
    }

    if (route.meta?.affix) {
      affixRoutes.push({
        path: fullPath,
        name: route.name,
        meta: route.meta
      })
    }

    // 递归处理子路由
    if (route.children) {
      affixRoutes.push(...findAffixRoutes(route.children, fullPath))
    }
  }

  return affixRoutes
}

/**
 * Tab 栏与路由联动
 */
export function useTabs() {
  const tabsStore = useTabsStore()
  const route = useRoute()

  // 初始化固定标签
  function initTabs() {
    const affixRoutes = findAffixRoutes(ROUTES_META as any[])
    tabsStore.initAffixTabs(affixRoutes)

    // 如果当前路由不在固定标签中，添加它
    if (route.meta && !route.meta.affix && !route.meta.hidden) {
      tabsStore.addTab({
        path: route.path,
        name: route.name as string | undefined,
        meta: route.meta
      })
    }
  }

  // 监听路由变化
  watch(
    () => route.path,
    (path) => {
      // 跳过隐藏路由（如 redirect 路由）
      if (route.meta?.hidden) return
      if (route.meta) {
        tabsStore.addTab({
          path,
          name: route.name as string | undefined,
          meta: route.meta
        })
      }
    }
  )

  onMounted(() => {
    initTabs()
  })

  return {
    tabsStore
  }
}
