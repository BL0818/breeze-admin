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
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { computed, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useFullscreen } from '@vueuse/core'
import { getIcon } from '@/lib/icon-map'
import { buildBreadcrumbs } from '@/lib/router-helpers'

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
    icon: getIcon(item.icon)
  }))
})

// 翻译面包屑标题
const translatedBreadcrumbs = computed(() => {
  return breadcrumbItems.value.map(item => ({
    ...item,
    title: t(item.title)
  }))
})

// 动态设置页面标题
watch(
  () => route.meta.title,
  (title) => {
    const titleKey = title as string | undefined
    document.title = titleKey ? `${t(titleKey)} - BreezeAdmin` : 'BreezeAdmin'
  },
  { immediate: true }
)
</script>

<template>
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
    <Breadcrumb v-if="themeStore.showBreadcrumb" class="hidden md:flex">
      <BreadcrumbList>
        <template v-for="(item, index) in translatedBreadcrumbs" :key="item.path">
          <BreadcrumbItem>
            <BreadcrumbLink v-if="index < translatedBreadcrumbs.length - 1 && item.hasComponent" :href="item.path" class="flex items-center gap-1.5">
              <component v-if="themeStore.showBreadcrumbIcon" :is="item.icon" class="h-4 w-4" />
              <span>{{ item.title }}</span>
            </BreadcrumbLink>
            <BreadcrumbPage v-else class="flex items-center gap-1.5" :class="{ 'text-muted-foreground font-normal': !item.hasComponent }">
              <component v-if="themeStore.showBreadcrumbIcon" :is="item.icon" class="h-4 w-4" />
              <span>{{ item.title }}</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator v-if="index < translatedBreadcrumbs.length - 1" />
        </template>
      </BreadcrumbList>
    </Breadcrumb>

    <!-- Spacer -->
    <div class="flex-1" />

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
          <Sun v-if="appStore.themeMode === 'light'" class="h-5 w-5" />
          <Moon v-else-if="appStore.themeMode === 'dark'" class="h-5 w-5" />
          <Monitor v-else class="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem @click="appStore.setTheme('light')" :class="{ 'bg-accent': appStore.themeMode === 'light' }">
          <Sun class="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem @click="appStore.setTheme('dark')" :class="{ 'bg-accent': appStore.themeMode === 'dark' }">
          <Moon class="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem @click="appStore.setTheme('system')" :class="{ 'bg-accent': appStore.themeMode === 'system' }">
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
</template>
