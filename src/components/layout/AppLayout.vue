<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import TabsBar from './TabsBar.vue'
import Footer from './Footer.vue'
import ThemeSettings from './ThemeSettings.vue'
import LoadingBar from './LoadingBar.vue'
import { Sheet } from '@/components/ui/sheet'
import { useAppStore } from '@/stores/app'
import { useThemeStore } from '@/stores/theme'
import { useTabsStore } from '@/stores/tabs'
import { useTabs } from '@/composables/use-tabs'
import { computed, watch } from 'vue'

const appStore = useAppStore()
const themeStore = useThemeStore()
const tabsStore = useTabsStore()
const route = useRoute()

// RouterView 的复合 key，包含 refreshKey 以支持刷新功能
const routerViewKey = computed(() => `${route.path}__${tabsStore.refreshKey}`)

// 初始化 tabs
useTabs()

// 路由变化时关闭移动端 Sheet
watch(() => route.path, () => {
  if (appStore.isMobileSidebarOpen) {
    appStore.isMobileSidebarOpen = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <LoadingBar />
    <!-- Desktop Sidebar - 仅在桌面端显示 -->
    <div class="hidden md:block">
      <Sidebar
        :collapsed="appStore.sidebarCollapsed"
      />
    </div>

    <!-- Mobile Sidebar (Sheet) - 禁用滚动条补偿 -->
    <Sheet v-model:open="appStore.isMobileSidebarOpen" :modal="true" scroll-behavior="body">
      <SheetContent side="left" class="!w-[280px] p-0 [&>button]:hidden">
        <SheetTitle class="sr-only">导航菜单</SheetTitle>
        <SheetDescription class="sr-only">侧边导航菜单</SheetDescription>
        <Sidebar :collapsed="false" />
      </SheetContent>
    </Sheet>

    <!-- Main Content -->
    <div
      class="flex flex-col h-screen overflow-hidden transition-all duration-300"
      :class="appStore.sidebarCollapsed ? 'md:pl-[var(--sidebar-collapsed-width)]' : 'md:pl-[var(--sidebar-width)]'"
    >
      <Header
        class="flex-shrink-0"
        @toggle-sidebar="appStore.toggleMobileSidebar"
        @toggle-desktop-sidebar="appStore.toggleSidebar"
      />

      <TabsBar v-if="themeStore.showTabsBar" class="flex-shrink-0" />

      <main class="flex-1 min-w-0 p-6 overflow-y-auto overflow-x-hidden">
        <RouterView v-slot="{ Component }">
          <Transition name="slide-fade" mode="out-in">
            <KeepAlive v-if="themeStore.tabsKeepAlive">
              <component :is="Component" :key="routerViewKey" />
            </KeepAlive>
            <component v-else :is="Component" :key="routerViewKey" />
          </Transition>
        </RouterView>
      </main>

      <Footer v-if="themeStore.showFooter" class="flex-shrink-0" :height="themeStore.footerHeight" />
    </div>

    <!-- 主题配置 Sheet -->
    <Sheet v-model:open="themeStore.settingsOpen">
      <ThemeSettings />
    </Sheet>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
