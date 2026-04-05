import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useDark, usePreferredDark } from '@vueuse/core'
import { hexToHsl, computeInfoColor, computeForeground } from '@/composables/use-color'

// ==================== 持久化版本 ====================
const THEME_STORE_VERSION = 3
const THEME_STORAGE_KEY = 'theme-config'

/**
 * 将默认值合并到 store 中，确保持久化恢复后缺失字段有合理默认值。
 */
function applyDefaults(store: Record<string, unknown>) {
  const defaults: Record<string, unknown> = {
    ...DEFAULT_COLORS,
    ...DEFAULT_LAYOUT,
    ...DEFAULT_GENERAL,
    isDark: false,
    themeMode: 'system',
  }
  for (const [key, value] of Object.entries(defaults)) {
    if (store[key] === undefined || store[key] === null) {
      ;(store as Record<string, unknown>)[key] = value
    }
  }
}

// ==================== 预设色板 ====================
export const THEME_PRESETS = [
  { id: 'blue',    primary: '#3b82f6' },
  { id: 'violet',  primary: '#8b5cf6' },
  { id: 'fuchsia', primary: '#d946ef' },
  { id: 'rose',    primary: '#f43f5e' },
  { id: 'orange',  primary: '#f97316' },
  { id: 'emerald', primary: '#10b981' },
  { id: 'cyan',    primary: '#06b6d4' },
] as const

// ==================== 默认配置 ====================
const DEFAULT_COLORS = {
  primaryColor: '#3b82f6',
  successColor: '#22c55e',
  warningColor: '#f59e0b',
  errorColor: '#ef4444',
}

const DEFAULT_LAYOUT = {
  showTabsBar: true,
  tabsKeepAlive: true,
  tabsMiddleClickClose: true,
  showBreadcrumb: true,
  showBreadcrumbIcon: true,
  sidebarWidth: 280,
  sidebarCollapsedWidth: 80,
  showFooter: true,
  footerHeight: 48,
}

const DEFAULT_GENERAL = {
  showLanguageBtn: true,
  showThemeBtn: true,
  showFullscreenBtn: true,
}

// ==================== Store ====================
export const useThemeStore = defineStore('theme', () => {
  const settingsOpen = ref(false)

  // ---- 暗色模式 ----
  const isDark = useDark({
    storage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    },
  })
  const preferredDark = usePreferredDark()
  const themeMode = ref<'light' | 'dark' | 'system'>('system')

  // ---- 颜色 ----
  const primaryColor = ref(DEFAULT_COLORS.primaryColor)
  const successColor = ref(DEFAULT_COLORS.successColor)
  const warningColor = ref(DEFAULT_COLORS.warningColor)
  const errorColor = ref(DEFAULT_COLORS.errorColor)

  // ---- 布局 ----
  const showTabsBar = ref(DEFAULT_LAYOUT.showTabsBar)
  const tabsKeepAlive = ref(DEFAULT_LAYOUT.tabsKeepAlive)
  const tabsMiddleClickClose = ref(DEFAULT_LAYOUT.tabsMiddleClickClose)
  const showBreadcrumb = ref(DEFAULT_LAYOUT.showBreadcrumb)
  const showBreadcrumbIcon = ref(DEFAULT_LAYOUT.showBreadcrumbIcon)
  const sidebarWidth = ref(DEFAULT_LAYOUT.sidebarWidth)
  const sidebarCollapsedWidth = ref(DEFAULT_LAYOUT.sidebarCollapsedWidth)
  const showFooter = ref(DEFAULT_LAYOUT.showFooter)
  const footerHeight = ref(DEFAULT_LAYOUT.footerHeight)

  // ---- 通用 ----
  const showLanguageBtn = ref(DEFAULT_GENERAL.showLanguageBtn)
  const showThemeBtn = ref(DEFAULT_GENERAL.showThemeBtn)
  const showFullscreenBtn = ref(DEFAULT_GENERAL.showFullscreenBtn)

  // ==================== CSS 变量注入 ====================

  /** 注入颜色 CSS 变量（含前景色自动适配） */
  function applyColors() {
    const root = document.documentElement

    // Primary
    root.style.setProperty('--primary', hexToHsl(primaryColor.value))
    root.style.setProperty('--ring', hexToHsl(primaryColor.value))
    root.style.setProperty('--primary-foreground', computeForeground(primaryColor.value))

    // Info (derived from primary)
    root.style.setProperty('--info', hexToHsl(computeInfoColor(primaryColor.value)))
    root.style.setProperty('--info-foreground', computeForeground(primaryColor.value))

    // Success
    root.style.setProperty('--success', hexToHsl(successColor.value))
    root.style.setProperty('--success-foreground', computeForeground(successColor.value))

    // Warning
    root.style.setProperty('--warning', hexToHsl(warningColor.value))
    root.style.setProperty('--warning-foreground', computeForeground(warningColor.value))

    // Destructive (error)
    root.style.setProperty('--destructive', hexToHsl(errorColor.value))
    root.style.setProperty('--destructive-foreground', computeForeground(errorColor.value))
  }

  /** 注入布局 CSS 变量 */
  function applyLayout() {
    const root = document.documentElement
    root.style.setProperty('--sidebar-width', `${sidebarWidth.value}px`)
    root.style.setProperty('--sidebar-collapsed-width', `${sidebarCollapsedWidth.value}px`)
    root.style.setProperty('--footer-height', `${footerHeight.value}px`)
  }

  // ==================== 暗色模式方法 ====================
  function toggleTheme() {
    isDark.value = !isDark.value
  }

  function setTheme(mode: 'light' | 'dark' | 'system') {
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

  // 布局变量响应式更新
  watch([sidebarWidth, sidebarCollapsedWidth, footerHeight], () => {
    applyLayout()
  })

  // ==================== 其他 Setters ====================
  function openSettings() { settingsOpen.value = true }
  function closeSettings() { settingsOpen.value = false }

  function setPrimaryColor(hex: string) {
    primaryColor.value = hex
    applyColors()
  }

  function setSuccessColor(hex: string) {
    successColor.value = hex
    applyColors()
  }

  function setWarningColor(hex: string) {
    warningColor.value = hex
    applyColors()
  }

  function setErrorColor(hex: string) {
    errorColor.value = hex
    applyColors()
  }

  function resetColors() {
    primaryColor.value = DEFAULT_COLORS.primaryColor
    successColor.value = DEFAULT_COLORS.successColor
    warningColor.value = DEFAULT_COLORS.warningColor
    errorColor.value = DEFAULT_COLORS.errorColor
    applyColors()
  }

  function resetTheme() {
    primaryColor.value = DEFAULT_COLORS.primaryColor
    successColor.value = DEFAULT_COLORS.successColor
    warningColor.value = DEFAULT_COLORS.warningColor
    errorColor.value = DEFAULT_COLORS.errorColor
    showTabsBar.value = DEFAULT_LAYOUT.showTabsBar
    tabsKeepAlive.value = DEFAULT_LAYOUT.tabsKeepAlive
    tabsMiddleClickClose.value = DEFAULT_LAYOUT.tabsMiddleClickClose
    showBreadcrumb.value = DEFAULT_LAYOUT.showBreadcrumb
    showBreadcrumbIcon.value = DEFAULT_LAYOUT.showBreadcrumbIcon
    sidebarWidth.value = DEFAULT_LAYOUT.sidebarWidth
    sidebarCollapsedWidth.value = DEFAULT_LAYOUT.sidebarCollapsedWidth
    showFooter.value = DEFAULT_LAYOUT.showFooter
    footerHeight.value = DEFAULT_LAYOUT.footerHeight
    showLanguageBtn.value = DEFAULT_GENERAL.showLanguageBtn
    showThemeBtn.value = DEFAULT_GENERAL.showThemeBtn
    showFullscreenBtn.value = DEFAULT_GENERAL.showFullscreenBtn
    themeMode.value = 'system'
    isDark.value = preferredDark.value
    applyColors()
    applyLayout()
  }

  function initTheme() {
    applyColors()
    applyLayout()
    // 首次启动时将版本号写入 localStorage，确保后续可检测版本变化
    try {
      const raw = localStorage.getItem(THEME_STORAGE_KEY)
      const data = raw ? JSON.parse(raw) : {}
      if (data._version !== THEME_STORE_VERSION) {
        data._version = THEME_STORE_VERSION
        localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(data))
      }
    } catch { /* ignore */ }
  }

  return {
    settingsOpen,
    // 暗色模式
    isDark, themeMode, preferredDark,
    toggleTheme, setTheme,
    // 颜色
    primaryColor, successColor, warningColor, errorColor,
    // 布局
    showTabsBar, tabsKeepAlive, tabsMiddleClickClose,
    showBreadcrumb, showBreadcrumbIcon,
    sidebarWidth, sidebarCollapsedWidth,
    showFooter, footerHeight,
    // 通用
    showLanguageBtn, showThemeBtn, showFullscreenBtn,
    // 方法
    openSettings, closeSettings,
    setPrimaryColor, setSuccessColor, setWarningColor, setErrorColor,
    resetColors, resetTheme,
    initTheme, applyColors, applyLayout,
  }
}, {
  persist: {
    key: THEME_STORAGE_KEY,
    storage: localStorage,
    paths: [
      'isDark', 'themeMode',
      'primaryColor', 'successColor', 'warningColor', 'errorColor',
      'showTabsBar', 'tabsKeepAlive', 'tabsMiddleClickClose',
      'showBreadcrumb', 'showBreadcrumbIcon',
      'sidebarWidth', 'sidebarCollapsedWidth',
      'showFooter', 'footerHeight',
      'showLanguageBtn', 'showThemeBtn', 'showFullscreenBtn',
    ],
    beforeRestore: () => {
      try {
        const raw = localStorage.getItem(THEME_STORAGE_KEY)
        if (raw) {
          const data = JSON.parse(raw)
          // 版本不兼容时清除旧缓存
          if (!data._version || data._version < THEME_STORE_VERSION) {
            localStorage.removeItem(THEME_STORAGE_KEY)
          }
        }
      } catch {
        localStorage.removeItem(THEME_STORAGE_KEY)
      }
    },
    afterRestore: (ctx) => {
      applyDefaults(ctx.store as Record<string, unknown>)
      // 迁移：从旧 'app' 键读取暗色模式偏好
      const store = ctx.store as Record<string, unknown>
      if (store.isDark === undefined || store.isDark === null || store.isDark === false) {
        try {
          const appData = JSON.parse(localStorage.getItem('app') || '{}')
          if (appData.isDark !== undefined && store.isDark === undefined) {
            store.isDark = appData.isDark
          }
          if (appData.themeMode !== undefined && store.themeMode === undefined) {
            store.themeMode = appData.themeMode
          }
        } catch { /* ignore */ }
      }
    },
  }
})
