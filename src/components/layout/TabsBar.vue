<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { useTabsStore } from '@/stores/tabs'
import { useRouter, useRoute } from 'vue-router'

const tabsStore = useTabsStore()
const router = useRouter()
const route = useRoute()

// 点击标签切换路由
function handleTabClick(path: string) {
  if (path !== route.path) {
    router.push(path)
  }
  tabsStore.setActiveTab(path)
}

// 关闭标签
function handleClose(e: Event, path: string) {
  e.stopPropagation()
  tabsStore.removeTab(path)
  // 如果关闭的是当前路由，切换到剩余的 activeTab
  if (path === route.path) {
    router.push(tabsStore.activeTab)
  }
}
</script>

<template>
  <div class="relative z-10 bg-background shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
    <div class="flex items-center gap-1 px-2 h-10 overflow-x-auto scrollbar-none">
      <button
        v-for="tab in tabsStore.tabs"
        :key="tab.path"
        @click="handleTabClick(tab.path)"
        class="group flex items-center gap-2 px-3 h-7 rounded-md text-sm transition-colors flex-shrink-0 whitespace-nowrap"
        :class="[
          tab.path === tabsStore.activeTab
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        ]"
      >
        <span>{{ tab.title }}</span>

        <!-- 关闭按钮 - 非固定标签显示 -->
        <span
          v-if="tab.closable"
          @click="handleClose($event, tab.path)"
          class="flex-shrink-0 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-muted-foreground/20 transition-opacity p-0.5"
        >
          <X class="h-3 w-3" />
        </span>

        <!-- 固定标签指示器 -->
        <span
          v-else
          class="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary/40"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
