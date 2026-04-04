<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch, type Component } from 'vue'
import {
  X, ChevronLeft, ChevronRight, ChevronsUpDown, RefreshCw, CircleX, ArrowLeftToLine, ArrowRightToLine,
  LayoutDashboard, ShoppingCart, FormInput, Settings, Search, FileText, ShieldCheck, Crown, Code
} from 'lucide-vue-next'
import { useTabsStore } from '@/stores/tabs'
import { useThemeStore } from '@/stores/theme'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import vuedraggable from 'vuedraggable'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const tabsStore = useTabsStore()
const themeStore = useThemeStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

// Lucide 图标名称到组件的映射
const iconMap: Record<string, Component> = {
  LayoutDashboard,
  ShoppingCart,
  FormInput,
  Settings,
  Search,
  FileText,
  ShieldCheck,
  Crown,
  Code,
}

// ==================== 滚动控制 ====================
const scrollContainer = ref<HTMLElement | null>(null)
const showScrollLeft = ref(false)
const showScrollRight = ref(false)

function updateScrollButtons() {
  if (!scrollContainer.value) return
  const el = scrollContainer.value
  showScrollLeft.value = el.scrollLeft > 2
  showScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 2
}

function scrollToLeft() {
  scrollContainer.value?.scrollBy({ left: -200, behavior: 'smooth' })
}

function scrollToRight() {
  scrollContainer.value?.scrollBy({ left: 200, behavior: 'smooth' })
}

function handleWheel(e: WheelEvent) {
  if (!scrollContainer.value) return
  const el = scrollContainer.value
  if (el.scrollWidth > el.clientWidth) {
    e.preventDefault()
    el.scrollBy({ left: e.deltaY })
    nextTick(() => updateScrollButtons())
  }
}

// ==================== 右键菜单 ====================
const contextMenuOpen = ref(false)
const contextMenuPath = ref('')
const contextMenuX = ref(0)
const contextMenuY = ref(0)

function handleContextMenu(e: MouseEvent, path: string) {
  e.preventDefault()
  contextMenuPath.value = path
  contextMenuX.value = e.clientX
  contextMenuY.value = e.clientY
  contextMenuOpen.value = true
}

// 右键菜单项的禁用状态
const contextTabClosable = computed(() => {
  const tab = tabsStore.tabs.find(t => t.path === contextMenuPath.value)
  return tab?.closable ?? false
})

const leftClosableCount = computed(() => {
  const index = tabsStore.tabs.findIndex(t => t.path === contextMenuPath.value)
  if (index <= 0) return 0
  return tabsStore.tabs.slice(0, index).filter(t => !t.affix).length
})

const rightClosableCount = computed(() => {
  const index = tabsStore.tabs.findIndex(t => t.path === contextMenuPath.value)
  if (index === -1) return 0
  return tabsStore.tabs.slice(index + 1).filter(t => !t.affix).length
})

const otherClosableCount = computed(() => {
  return tabsStore.closableTabs.filter(t => t.path !== contextMenuPath.value).length
})

// 右键菜单操作
function closeContextMenu() {
  contextMenuOpen.value = false
}

function handleCtxRefresh() {
  if (contextMenuPath.value === route.path) {
    tabsStore.refreshCurrentTab()
  } else {
    router.push(contextMenuPath.value).then(() => {
      tabsStore.refreshCurrentTab()
    })
  }
  closeContextMenu()
}

function handleCtxClose() {
  tabsStore.removeTab(contextMenuPath.value)
  if (contextMenuPath.value === route.path) {
    router.push(tabsStore.activeTab)
  }
  closeContextMenu()
}

function handleCtxCloseOthers() {
  tabsStore.closeOtherTabs(contextMenuPath.value)
  if (route.path !== contextMenuPath.value) {
    router.push(contextMenuPath.value)
  }
  closeContextMenu()
}

function handleCtxCloseLeft() {
  tabsStore.closeLeftTabs(contextMenuPath.value)
  if (!tabsStore.tabs.some(tab => tab.path === route.path)) {
    router.push(contextMenuPath.value)
  }
  closeContextMenu()
}

function handleCtxCloseRight() {
  tabsStore.closeRightTabs(contextMenuPath.value)
  if (!tabsStore.tabs.some(tab => tab.path === route.path)) {
    router.push(contextMenuPath.value)
  }
  closeContextMenu()
}

// ==================== 拖拽排序 ====================
function onDragEnd(evt: { oldIndex: number; newIndex: number }) {
  tabsStore.sortTabs(evt.oldIndex, evt.newIndex)
}

// ==================== 标签交互 ====================

// 点击标签：切换路由；已激活标签不做任何操作
function handleTabClick(path: string) {
  if (path === route.path) return
  router.push(path)
  tabsStore.setActiveTab(path)
}

// 鼠标中键关闭标签页
function handleAuxClick(e: MouseEvent, path: string) {
  if (e.button === 1 && themeStore.tabsMiddleClickClose) {
    e.preventDefault()
    handleClose(e, path)
  }
}

// 关闭标签
function handleClose(e: Event, path: string) {
  e.stopPropagation()
  tabsStore.removeTab(path)
  if (path === route.path) {
    router.push(tabsStore.activeTab)
  }
}

// 双击关闭标签
function handleDoubleClick(path: string) {
  const tab = tabsStore.tabs.find(t => t.path === path)
  if (tab?.closable) {
    tabsStore.removeTab(path)
    if (path === route.path) {
      router.push(tabsStore.activeTab)
    }
  }
}

// ==================== 右键菜单外部点击关闭 ====================
function handleGlobalClick(e: MouseEvent) {
  if (!contextMenuOpen.value) return
  const target = e.target as HTMLElement
  if (!target.closest('.tabs-context-menu')) {
    closeContextMenu()
  }
}

// 路由变化时关闭右键菜单
watch(() => route.path, () => {
  closeContextMenu()
})

// ==================== 生命周期 ====================
onMounted(() => {
  nextTick(() => updateScrollButtons())
  window.addEventListener('resize', updateScrollButtons)
  document.addEventListener('mousedown', handleGlobalClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScrollButtons)
  document.removeEventListener('mousedown', handleGlobalClick)
})
</script>

<template>
  <div>
    <div class="relative z-10 bg-background shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
    <div class="flex items-center h-10">
      <!-- 左侧滚动按钮 -->
      <button
        v-if="showScrollLeft"
        @click="scrollToLeft"
        class="flex-shrink-0 flex items-center justify-center w-7 h-full hover:bg-muted transition-colors text-muted-foreground"
      >
        <ChevronLeft class="h-4 w-4" />
      </button>

      <!-- 可拖拽标签区域 -->
      <div
        ref="scrollContainer"
        class="flex items-center gap-1 px-2 flex-1 overflow-x-auto scrollbar-none"
        @scroll="updateScrollButtons"
        @wheel="handleWheel"
      >
        <vuedraggable
          :list="tabsStore.tabs"
          item-key="path"
          class="flex items-center gap-1"
          @end="onDragEnd"
        >
          <template #item="{ element: tab }">
            <button
              @click="handleTabClick(tab.path)"
              @auxclick="(e: MouseEvent) => handleAuxClick(e, tab.path)"
              @contextmenu="(e: MouseEvent) => handleContextMenu(e, tab.path)"
              @dblclick="handleDoubleClick(tab.path)"
              class="group flex items-center gap-2 px-3 h-7 rounded-md text-sm transition-colors flex-shrink-0 whitespace-nowrap"
              :class="[
                tab.path === tabsStore.activeTab
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              ]"
            >
              <span>{{ tab.dynamicTitle || tab.title }}</span>

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
          </template>
        </vuedraggable>
      </div>

      <!-- 右侧滚动按钮 -->
      <button
        v-if="showScrollRight"
        @click="scrollToRight"
        class="flex-shrink-0 flex items-center justify-center w-7 h-full hover:bg-muted transition-colors text-muted-foreground"
      >
        <ChevronRight class="h-4 w-4" />
      </button>

      <!-- 更多标签下拉菜单 -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button class="flex-shrink-0 flex items-center justify-center w-7 h-full hover:bg-muted transition-colors text-muted-foreground">
            <ChevronsUpDown class="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="max-h-60 overflow-y-auto w-48">
          <DropdownMenuItem
            v-for="tab in tabsStore.tabs"
            :key="tab.path"
            @click="handleTabClick(tab.path)"
            :class="tab.path === tabsStore.activeTab ? 'bg-accent' : ''"
          >
            <component v-if="tab.icon && iconMap[tab.icon]" :is="iconMap[tab.icon]" class="h-4 w-4 mr-2 flex-shrink-0" />
            <span class="truncate">{{ tab.dynamicTitle || tab.title }}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    </div>

    <!-- 右键上下文菜单 -->
    <Teleport to="body">
    <div
      v-if="contextMenuOpen"
      class="tabs-context-menu fixed z-[9999] min-w-40 rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
      :style="{ left: `${contextMenuX}px`, top: `${contextMenuY}px` }"
    >
      <button class="ctx-item" @click="handleCtxRefresh">
        <RefreshCw class="h-4 w-4 mr-2" />
        {{ t('tabs.refresh') }}
      </button>
      <button
        class="ctx-item"
        :disabled="!contextTabClosable"
        @click="handleCtxClose"
      >
        <X class="h-4 w-4 mr-2" />
        {{ t('tabs.close') }}
      </button>
      <div class="ctx-separator" />
      <button
        class="ctx-item"
        :disabled="leftClosableCount === 0"
        @click="handleCtxCloseLeft"
      >
        <ArrowLeftToLine class="h-4 w-4 mr-2" />
        {{ t('tabs.closeLeft') }}
      </button>
      <button
        class="ctx-item"
        :disabled="rightClosableCount === 0"
        @click="handleCtxCloseRight"
      >
        <ArrowRightToLine class="h-4 w-4 mr-2" />
        {{ t('tabs.closeRight') }}
      </button>
      <button
        class="ctx-item"
        :disabled="otherClosableCount === 0"
        @click="handleCtxCloseOthers"
      >
        <CircleX class="h-4 w-4 mr-2" />
        {{ t('tabs.closeOthers') }}
      </button>
    </div>
  </Teleport>
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

/* 右键菜单项 */
.ctx-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 6px 8px;
  font-size: 0.875rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.15s;
  color: inherit;
  background: none;
  border: none;
  text-align: left;
}
.ctx-item:hover:not(:disabled) {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}
.ctx-item:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.ctx-separator {
  height: 1px;
  background-color: hsl(var(--border));
  margin: 4px 0;
}
</style>
