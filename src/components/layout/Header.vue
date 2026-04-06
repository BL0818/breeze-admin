<script setup lang="ts">
import { Menu, Bell, Moon, Sun, Globe, LogOut, AlignJustify, Monitor, Maximize, Minimize, SwatchBook } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { computed, watch, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useFullscreen } from '@vueuse/core'
import { getIcon } from '@/lib/icon-map'
import { buildBreadcrumbs, getChildRoutes, type RouteMetaInfo } from '@/lib/router-helpers'
import type { Component } from 'vue'

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
  (e: 'toggle-desktop-sidebar'): void
}>()

const { t } = useI18n()
const appStore = useAppStore()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const route = useRoute()
const router = useRouter()
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

// 退出确认对话框
const showLogoutDialog = ref(false)

// 面包屑容器引用
const breadcrumbWrapper = ref<HTMLElement | null>(null)

// 面包屑显示模式: full / icon
const breadcrumbMode = ref<'full' | 'icon'>('full')

// 文本是否被 CSS 截断（显示省略号）
const isBreadcrumbTruncated = ref(false)

// 用户名首字母
const userInitials = computed(() => {
  const name = authStore.user?.name || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
})

// 确认退出登录
const confirmLogout = () => {
  authStore.logout()
  router.push('/login')
}

// 构建面包屑项 - 使用 O(1) 查找的扁平化路由 Map
const breadcrumbItems = computed(() => {
  const breadcrumbs = buildBreadcrumbs(route.path)

  return breadcrumbs.map(item => ({
    path: item.path,
    title: item.title,
    icon: getIcon(item.icon),
    hasComponent: item.hasComponent
  }))
})

interface BreadcrumbEntry {
  path: string
  title: string
  icon: Component
  hasComponent: boolean
  children: RouteMetaInfo[]
}

// 翻译面包屑标题 + 子路由信息
const translatedBreadcrumbs = computed<BreadcrumbEntry[]>(() => {
  return breadcrumbItems.value.map(item => ({
    ...item,
    title: t(item.title),
    children: getChildRoutes(item.path)
  }))
})

// 是否处于"压缩态"（文本被截断或仅显示图标）
const isCompact = computed(() => isBreadcrumbTruncated.value || breadcrumbMode.value === 'icon')

// 动态设置页面标题
watch(
  () => route.meta.title,
  (title) => {
    const titleKey = title as string | undefined
    const appTitle = import.meta.env.VITE_APP_TITLE || 'BreezeAdmin'
    document.title = titleKey ? `${t(titleKey)} - ${appTitle}` : appTitle
  },
  { immediate: true }
)

// 面包屑自适应: 检测文本压缩状态，决定是否切换到 icon-only
let resizeObserver: ResizeObserver | null = null

const detectBreadcrumbMode = () => {
  if (!breadcrumbWrapper.value) return

  if (breadcrumbMode.value === 'full') {
    const textSpans = breadcrumbWrapper.value.querySelectorAll('.breadcrumb-text')
    if (textSpans.length === 0) return

    // 检测是否有文本被 CSS 截断
    const anyTruncated = Array.from(textSpans).some(
      span => (span as HTMLElement).scrollWidth > (span as HTMLElement).clientWidth + 1
    )
    isBreadcrumbTruncated.value = anyTruncated

    // 检测是否所有文本都被压缩到不可读
    const allSqueezed = Array.from(textSpans).every(
      span => span.getBoundingClientRect().width < 12
    )
    if (allSqueezed) {
      breadcrumbMode.value = 'icon'
    }
  } else {
    // icon 模式: 检测是否有足够空间恢复文本
    const icons = breadcrumbWrapper.value.querySelectorAll('.breadcrumb-icon')
    if (icons.length === 0) return

    let iconOnlyWidth = 0
    icons.forEach(el => {
      iconOnlyWidth += el.getBoundingClientRect().width + 6
    })

    const available = breadcrumbWrapper.value.clientWidth
    const textBudget = available - iconOnlyWidth - 20
    if (textBudget > icons.length * 40) {
      breadcrumbMode.value = 'full'
    }
  }
}

onMounted(() => {
  if (!breadcrumbWrapper.value) return

  resizeObserver = new ResizeObserver(() => {
    detectBreadcrumbMode()
  })
  resizeObserver.observe(breadcrumbWrapper.value)

  nextTick(detectBreadcrumbMode)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <header class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4">
      <!-- Mobile Menu Toggle -->
      <Button variant="ghost" size="icon" class="md:hidden" @click="emit('toggle-sidebar')">
        <Menu class="h-5 w-5" />
      </Button>

      <!-- Desktop Sidebar Toggle -->
      <Button variant="ghost" size="icon" class="hidden md:flex" @click="emit('toggle-desktop-sidebar')">
        <AlignJustify class="h-5 w-5" />
      </Button>

      <!-- Breadcrumb -->
      <div
        v-if="themeStore.showBreadcrumb"
        ref="breadcrumbWrapper"
        class="hidden md:block min-w-0 flex-1 overflow-hidden"
      >
        <Breadcrumb>
          <BreadcrumbList>
            <template v-for="(item, index) in translatedBreadcrumbs" :key="item.path">
              <BreadcrumbItem class="min-w-0 overflow-hidden">
                <!-- 非最后一级 & 有子路由 → 下拉菜单 -->
                <DropdownMenu v-if="index < translatedBreadcrumbs.length - 1 && item.children.length > 0">
                  <DropdownMenuTrigger as-child>
                    <BreadcrumbLink
                      class="flex items-center gap-1.5 min-w-0 overflow-hidden cursor-pointer"
                    >
                      <component
                        v-if="themeStore.showBreadcrumbIcon"
                        :is="item.icon"
                        class="h-4 w-4 shrink-0 breadcrumb-icon"
                      />
                      <span
                        v-if="breadcrumbMode !== 'icon'"
                        class="breadcrumb-text overflow-hidden text-ellipsis whitespace-nowrap"
                      >{{ item.title }}</span>
                    </BreadcrumbLink>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" class="min-w-[160px]">
                    <!-- 压缩态时在顶部显示自己的导航名称 -->
                    <DropdownMenuLabel v-if="isCompact">{{ item.title }}</DropdownMenuLabel>
                    <DropdownMenuSeparator v-if="isCompact" />
                    <DropdownMenuItem
                      v-for="child in item.children"
                      :key="child.path"
                      :disabled="!child.hasComponent"
                      :class="{ 'opacity-50 cursor-not-allowed': !child.hasComponent }"
                      @click="child.hasComponent && router.push(child.path)"
                    >
                      <component
                        v-if="child.icon && themeStore.showBreadcrumbIcon"
                        :is="getIcon(child.icon)"
                        class="mr-2 h-4 w-4"
                      />
                      {{ t(child.title ?? '') }}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <!-- 非最后一级 & 无子路由 → 普通链接 -->
                <BreadcrumbLink
                  v-else-if="index < translatedBreadcrumbs.length - 1"
                  :href="item.path"
                  class="flex items-center gap-1.5 min-w-0 overflow-hidden"
                >
                  <component
                    v-if="themeStore.showBreadcrumbIcon"
                    :is="item.icon"
                    class="h-4 w-4 shrink-0 breadcrumb-icon"
                  />
                  <span
                    v-if="breadcrumbMode !== 'icon'"
                    class="breadcrumb-text overflow-hidden text-ellipsis whitespace-nowrap"
                  >{{ item.title }}</span>
                </BreadcrumbLink>

                <!-- 最后一级 → Tooltip（始终显示完整标题） -->
                <BreadcrumbPage
                  v-else
                  class="flex items-center gap-1.5 min-w-0 overflow-hidden"
                  :class="{ 'text-muted-foreground font-normal': !item.hasComponent }"
                >
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span class="flex items-center gap-1.5">
                        <component
                          v-if="themeStore.showBreadcrumbIcon"
                          :is="item.icon"
                          class="h-4 w-4 shrink-0 breadcrumb-icon"
                        />
                        <span
                          v-if="breadcrumbMode !== 'icon'"
                          class="breadcrumb-text overflow-hidden text-ellipsis whitespace-nowrap"
                        >{{ item.title }}</span>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {{ item.title }}
                    </TooltipContent>
                  </Tooltip>
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator v-if="index < translatedBreadcrumbs.length - 1" class="shrink-0" />
            </template>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <!-- Spacer (only on mobile, on desktop breadcrumb uses flex-1) -->
      <div class="flex-1 md:hidden" />

      <!-- Settings Button -->
      <Button variant="ghost" size="icon" @click="themeStore.openSettings()">
        <SwatchBook class="h-5 w-5" />
      </Button>

      <!-- Fullscreen Toggle -->
      <Button v-if="themeStore.showFullscreenBtn" variant="ghost" size="icon" @click="toggleFullscreen">
        <Minimize v-if="isFullscreen" class="h-5 w-5" />
        <Maximize v-else class="h-5 w-5" />
      </Button>

      <!-- Theme Toggle -->
      <DropdownMenu v-if="themeStore.showThemeBtn">
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon">
            <Sun v-if="themeStore.themeMode === 'light'" class="h-5 w-5" />
            <Moon v-else-if="themeStore.themeMode === 'dark'" class="h-5 w-5" />
            <Monitor v-else class="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="themeStore.setTheme('light')" :class="{ 'bg-accent': themeStore.themeMode === 'light' }">
            <Sun class="mr-2 h-4 w-4" />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem @click="themeStore.setTheme('dark')" :class="{ 'bg-accent': themeStore.themeMode === 'dark' }">
            <Moon class="mr-2 h-4 w-4" />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem @click="themeStore.setTheme('system')" :class="{ 'bg-accent': themeStore.themeMode === 'system' }">
            <Monitor class="mr-2 h-4 w-4" />
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Language Toggle -->
      <DropdownMenu v-if="themeStore.showLanguageBtn">
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon">
            <Globe class="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="appStore.setLanguage('en')" :class="{ 'bg-accent': appStore.language === 'en' }">
            English
          </DropdownMenuItem>
          <DropdownMenuItem @click="appStore.setLanguage('zh')" :class="{ 'bg-accent': appStore.language === 'zh' }">
            中文
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Notifications -->
      <Button variant="ghost" size="icon">
        <Bell class="h-5 w-5" />
      </Button>

      <!-- User Info -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" class="flex items-center gap-2 rounded-lg px-2 py-1.5 h-auto">
            <Avatar class="h-7 w-7">
              <AvatarFallback class="text-xs">{{ userInitials }}</AvatarFallback>
            </Avatar>
            <span class="text-sm font-medium hidden lg:block">{{ authStore.user?.name }}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-56">
          <DropdownMenuItem>{{ t('common.profile') }}</DropdownMenuItem>
          <DropdownMenuItem>{{ t('common.settings') }}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="text-red-600 cursor-pointer" @click="showLogoutDialog = true">
            <LogOut class="mr-2 h-4 w-4" />
            {{ t('common.logout') }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Logout Confirm Dialog -->
      <ConfirmDialog
        v-model:open="showLogoutDialog"
        :title="t('common.confirmLogout')"
        :description="t('common.confirmLogoutDesc')"
        :confirm-text="t('common.confirm')"
        :cancel-text="t('common.cancel')"
        variant="destructive"
        @confirm="confirmLogout"
      />
    </header>
  </TooltipProvider>
</template>
