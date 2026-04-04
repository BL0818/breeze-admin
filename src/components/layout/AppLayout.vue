<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import TabsBar from './TabsBar.vue'
import Footer from './Footer.vue'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { useAppStore } from '@/stores/app'
import { useTabs } from '@/composables/use-tabs'
import { computed, watch } from 'vue'

const appStore = useAppStore()
const route = useRoute()

// 初始化 tabs
useTabs()

// 侧边栏宽度计算
const sidebarWidth = computed(() => appStore.sidebarCollapsed ? '80px' : '280px')

// 路由变化时关闭移动端 Sheet
watch(() => route.path, () => {
  if (appStore.isMobileSidebarOpen) {
    appStore.isMobileSidebarOpen = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-background">
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
      class="flex flex-col h-screen overflow-hidden md:pl-[var(--sidebar-width)] transition-all duration-300"
      :style="{ '--sidebar-width': sidebarWidth }"
    >
      <Header
        class="flex-shrink-0"
        @toggle-sidebar="appStore.toggleMobileSidebar"
        @toggle-desktop-sidebar="appStore.toggleSidebar"
      />

      <TabsBar class="flex-shrink-0" />

      <main class="flex-1 min-w-0 p-6 overflow-y-auto overflow-x-hidden">
        <RouterView v-slot="{ Component }">
          <Transition name="slide-fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </RouterView>
      </main>

      <Footer class="flex-shrink-0" />
    </div>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.25s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(-24px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(24px);
  opacity: 0;
}
</style>
