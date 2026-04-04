import { useRoute } from 'vue-router'
import { useTabsStore } from '@/stores/tabs'

/**
 * 允许页面组件动态设置标签页标题
 * @param initialTitle 可选的初始动态标题
 */
export function useTabTitle(initialTitle?: string) {
  const route = useRoute()
  const tabsStore = useTabsStore()

  if (initialTitle) {
    tabsStore.updateDynamicTitle(route.path, initialTitle)
  }

  /**
   * 运行时更新标签标题
   */
  function setTitle(title: string) {
    tabsStore.updateDynamicTitle(route.path, title)
  }

  /**
   * 清除动态标题，恢复 i18n 默认标题
   */
  function clearTitle() {
    tabsStore.clearDynamicTitle(route.path)
  }

  return { setTitle, clearTitle }
}
