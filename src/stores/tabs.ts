import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AppRouteMeta } from '@/router/types'
import { i18n } from '@/locales'

export interface TabItem {
  path: string
  name: string
  titleKey?: string  // i18n key
  title: string      // 显示用的翻译后标题
  icon?: string
  affix?: boolean
  closable: boolean
  dynamicTitle?: string  // 组件动态设置的标题（如 "编辑用户 - 张三"）
}

export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<TabItem[]>([])
  const activeTab = ref<string>('/')
  const refreshKey = ref(0)

  // 固定标签（从路由 meta.affix 获取）
  const affixedTabs = computed(() => tabs.value.filter(tab => tab.affix))

  // 可关闭标签
  const closableTabs = computed(() => tabs.value.filter(tab => tab.closable))

  // 翻译标题
  function translateTitle(titleKey: string | undefined, fallback: string): string {
    if (titleKey) {
      const translated = i18n.global.t(titleKey)
      return translated !== titleKey ? translated : fallback
    }
    return fallback
  }

  // 刷新所有标签的翻译标题
  function refreshAllTabTitles() {
    for (const tab of tabs.value) {
      if (tab.titleKey) {
        tab.title = translateTitle(tab.titleKey, tab.name)
      }
    }
  }

  // 添加标签
  function addTab(route: { path: string; name?: string; meta: AppRouteMeta }) {
    const { path, name, meta } = route

    // 已存在则不重复添加
    if (tabs.value.some(tab => tab.path === path)) {
      activeTab.value = path
      return
    }

    const titleKey = meta.title as string | undefined
    const title = translateTitle(titleKey, name || path)
    const isAffix = meta.affix ?? false

    tabs.value.push({
      path,
      name: name || path,
      titleKey,
      title,
      icon: meta.icon,
      affix: isAffix,
      closable: !isAffix // 固定标签不可关闭
    })

    activeTab.value = path
  }

  // 移除标签
  function removeTab(path: string) {
    const index = tabs.value.findIndex(tab => tab.path === path)
    if (index === -1) return

    const tab = tabs.value[index]
    if (tab.affix) return // 固定标签不可移除

    tabs.value.splice(index, 1)

    // 如果移除的是当前激活标签，切换到上一个或下一个
    if (activeTab.value === path) {
      const newIndex = Math.min(index, tabs.value.length - 1)
      activeTab.value = tabs.value[newIndex]?.path || '/'
    }
  }

  // 切换标签
  function setActiveTab(path: string) {
    if (tabs.value.some(tab => tab.path === path)) {
      activeTab.value = path
    }
  }

  // 更新标签标题
  function updateTabTitle(path: string, title: string) {
    const tab = tabs.value.find(t => t.path === path)
    if (tab) {
      tab.title = title
    }
  }

  // 关闭其他标签（保留指定标签 + 所有固定标签）
  function closeOtherTabs(keepPath: string) {
    tabs.value = tabs.value.filter(tab => tab.path === keepPath || tab.affix)
    if (!tabs.value.some(tab => tab.path === activeTab.value)) {
      activeTab.value = keepPath
    }
  }

  // 关闭左侧标签
  function closeLeftTabs(path: string) {
    const index = tabs.value.findIndex(tab => tab.path === path)
    if (index <= 0) return

    const left = tabs.value.splice(0, index)
    // 将左侧中的固定标签插回开头
    const affixLeft = left.filter(tab => tab.affix)
    if (affixLeft.length > 0) {
      tabs.value.unshift(...affixLeft)
    }

    if (!tabs.value.some(tab => tab.path === activeTab.value)) {
      activeTab.value = path
    }
  }

  // 关闭右侧标签
  function closeRightTabs(path: string) {
    const index = tabs.value.findIndex(tab => tab.path === path)
    if (index === -1 || index === tabs.value.length - 1) return

    const right = tabs.value.splice(index + 1)
    // 将右侧中的固定标签插回末尾
    const affixRight = right.filter(tab => tab.affix)
    if (affixRight.length > 0) {
      tabs.value.push(...affixRight)
    }

    if (!tabs.value.some(tab => tab.path === activeTab.value)) {
      activeTab.value = path
    }
  }

  // 刷新当前页面（递增 key 触发 RouterView 重新渲染）
  function refreshCurrentTab() {
    refreshKey.value++
  }

  // 设置动态标题
  function updateDynamicTitle(path: string, dynamicTitle: string) {
    const tab = tabs.value.find(t => t.path === path)
    if (tab) {
      tab.dynamicTitle = dynamicTitle
    }
  }

  // 清除动态标题
  function clearDynamicTitle(path: string) {
    const tab = tabs.value.find(t => t.path === path)
    if (tab) {
      tab.dynamicTitle = undefined
    }
  }

  // 拖拽排序
  function sortTabs(fromIndex: number, toIndex: number) {
    const [moved] = tabs.value.splice(fromIndex, 1)
    tabs.value.splice(toIndex, 0, moved)
  }

  // 初始化固定标签（从路由配置读取）
  function initAffixTabs(affixRoutes: Array<{ path: string; name?: string; meta: AppRouteMeta }>) {
    // 如果已有持久化数据，仅补全缺失的固定标签
    if (tabs.value.length > 0) {
      for (const route of affixRoutes) {
        if (tabs.value.some(tab => tab.path === route.path)) continue
        const titleKey = route.meta.title as string | undefined
        const title = translateTitle(titleKey, route.name || route.path)
        tabs.value.unshift({
          path: route.path,
          name: route.name || route.path,
          titleKey,
          title,
          icon: route.meta.icon,
          affix: true,
          closable: false
        })
      }
      return
    }

    // 首次访问，清空并初始化
    tabs.value = []
    for (const route of affixRoutes) {
      const titleKey = route.meta.title as string | undefined
      const title = translateTitle(titleKey, route.name || route.path)
      tabs.value.push({
        path: route.path,
        name: route.name || route.path,
        titleKey,
        title,
        icon: route.meta.icon,
        affix: true,
        closable: false
      })
    }

    // 设置当前活动标签
    if (tabs.value.length > 0 && !activeTab.value) {
      activeTab.value = tabs.value[0].path
    }
  }

  return {
    tabs,
    activeTab,
    refreshKey,
    affixedTabs,
    closableTabs,
    addTab,
    removeTab,
    setActiveTab,
    updateTabTitle,
    refreshAllTabTitles,
    initAffixTabs,
    closeOtherTabs,
    closeLeftTabs,
    closeRightTabs,
    refreshCurrentTab,
    updateDynamicTitle,
    clearDynamicTitle,
    sortTabs
  }
}, {
  persist: {
    key: 'tabs',
    storage: localStorage,
    paths: ['tabs', 'activeTab']
  }
})
