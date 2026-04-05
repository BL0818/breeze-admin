import { defineStore } from 'pinia'
import { ref } from 'vue'
import { i18n } from '@/locales'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const isMobileSidebarOpen = ref(false)
  const language = ref('en')

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const toggleMobileSidebar = () => {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value
  }

  const setLanguage = (lang: string) => {
    language.value = lang
    i18n.global.locale.value = lang as 'en' | 'zh'
    // 刷新 tabs 翻译
    import('@/stores/tabs').then(({ useTabsStore }) => {
      useTabsStore().refreshAllTabTitles()
    })
  }

  return {
    sidebarCollapsed,
    isMobileSidebarOpen,
    language,
    toggleSidebar,
    toggleMobileSidebar,
    setLanguage
  }
}, {
  persist: {
    key: 'app',
    storage: localStorage,
    paths: ['sidebarCollapsed', 'language']
  }
})
