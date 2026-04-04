import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useDark, usePreferredDark } from '@vueuse/core'
import { i18n } from '@/locales'

type ThemeMode = 'light' | 'dark' | 'system'

export const useAppStore = defineStore('app', () => {
  const isDark = useDark()
  const preferredDark = usePreferredDark()
  const sidebarCollapsed = ref(false)
  const isMobileSidebarOpen = ref(false)
  const language = ref('en')
  const themeMode = ref<ThemeMode>('system')

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const toggleMobileSidebar = () => {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  const setTheme = (mode: ThemeMode) => {
    themeMode.value = mode
    if (mode === 'system') {
      isDark.value = preferredDark.value
    } else {
      isDark.value = mode === 'dark'
    }
  }

  // 监听系统主题变化
  watch(preferredDark, (newValue) => {
    if (themeMode.value === 'system') {
      isDark.value = newValue
    }
  })

  const setLanguage = (lang: string) => {
    language.value = lang
    i18n.global.locale.value = lang as 'en' | 'zh'
    // 刷新 tabs 翻译
    import('@/stores/tabs').then(({ useTabsStore }) => {
      useTabsStore().refreshAllTabTitles()
    })
  }

  return {
    isDark,
    themeMode,
    sidebarCollapsed,
    isMobileSidebarOpen,
    language,
    toggleSidebar,
    toggleMobileSidebar,
    toggleTheme,
    setTheme,
    setLanguage
  }
}, {
  persist: {
    key: 'app',
    storage: localStorage,
    paths: ['isDark', 'sidebarCollapsed', 'language', 'themeMode']
  }
})
