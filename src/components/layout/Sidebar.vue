<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  FormInput,
  Settings,
  Settings2,
  Shield,
  UserCog,
  Menu,
  ChevronRight,
  ChevronDown,
  Wind,
  Search,
  FileText,
  ShieldCheck,
  Crown,
  Code
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useI18n } from 'vue-i18n'
import { ROUTES_META } from '@/router/routes-config'
import { hasPermission } from '@/router/permissions'
import type { AppRouteConfig } from '@/router/types'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

// 定义 props
const props = defineProps<{
  collapsed?: boolean
}>()

// 使用 props 避免未使用变量警告
const isCollapsed = computed(() => props.collapsed ?? false)

// Lucide 图标名称到组件的映射
const iconMap: Record<string, Component> = {
  LayoutDashboard,
  ShoppingCart,
  Users,
  FormInput,
  Settings,
  Settings2,
  Shield,
  UserCog,
  Menu,
  Wind,
  Search,
  FileText,
  ShieldCheck,
  Crown,
  Code,
}

const { t } = useI18n()
const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()

// 展开状态管理
const expandedMenus = ref<Set<string>>(new Set())

// 收起态 Popover 开关状态
const activePopover = ref<string | null>(null)
const closePopover = () => { activePopover.value = null }

interface MenuItem {
  path: string
  name: string
  icon: Component
  hasChildren: boolean
  children: MenuItem[]
}

// 递归构建菜单项
function buildMenuItems(children: AppRouteConfig[], parentPath = ''): MenuItem[] {
  return children
    .filter(child => {
      const meta = child.meta || {}
      // 过滤掉隐藏路由
      if (meta.hidden) return false
      if (!hasPermission(meta.roles, authStore.user?.role)) return false
      return true
    })
    .map(child => {
      const meta = child.meta || {}
      // 处理空路径：映射为 '/'（如 Dashboard 的 path 是 ''）
      const fullPath = child.path === ''
        ? (parentPath || '/')
        : (parentPath ? `${parentPath}/${child.path}` : `/${child.path}`)
      const hasChildren = !!(child.children && child.children.some(c => !c.meta?.hidden))

      return {
        path: fullPath,
        name: t(meta.title || child.name || ''),
        icon: meta.icon ? (iconMap[meta.icon] || LayoutDashboard) : LayoutDashboard,
        hasChildren,
        children: child.children ? buildMenuItems(child.children, fullPath) : []
      }
    })
}

// 从 ROUTES_META 直接获取侧边栏菜单
const navItems = computed(() => {
  const layoutRoute = ROUTES_META.find(r => r.path === '/')
  if (!layoutRoute?.children) return []

  return buildMenuItems(layoutRoute.children)
})

const isExpanded = (item: MenuItem) => expandedMenus.value.has(item.path)

// 手风琴模式：展开时关闭同层级其他菜单
const toggleExpand = (item: MenuItem, siblings?: MenuItem[]) => {
  if (!item.hasChildren) return
  if (expandedMenus.value.has(item.path)) {
    expandedMenus.value.delete(item.path)
  } else {
    // 关闭同层级其他菜单
    if (siblings) {
      siblings.forEach(s => {
        if (s.path !== item.path && s.hasChildren) {
          expandedMenus.value.delete(s.path)
        }
      })
    }
    expandedMenus.value.add(item.path)
  }
}

// 检查当前路由是否精确激活（仅用于叶子节点）
const isExactActive = (path: string) => {
  return route.path === path || (path === '/' && route.path === '')
}

// 检查当前路由是否是该路径的子路由（用于判断是否需要展开父菜单）
const isSubActive = (path: string) => {
  return route.path.startsWith(`${path}/`)
}

// 递归查找包含目标路径的菜单分支，返回需要展开的路径列表
function findActiveMenuPath(items: MenuItem[], targetPath: string): string[] {
  for (const item of items) {
    // 精确匹配
    if (item.path === targetPath) return []
    // 子路径匹配
    if (targetPath.startsWith(`${item.path}/`)) {
      const childPath = findActiveMenuPath(item.children, targetPath)
      return [item.path, ...childPath]
    }
  }
  return []
}

// 路由变化时自动展开当前菜单分支
watch(() => route.path, (newPath) => {
  expandedMenus.value.clear()
  const paths = findActiveMenuPath(navItems.value, newPath)
  paths.forEach(p => expandedMenus.value.add(p))
}, { immediate: true })
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <aside
      :class="cn(
        'fixed left-0 top-0 z-40 h-screen bg-card shadow-[2px_0_8px_rgba(0,0,0,0.06)] transition-all duration-300',
        isCollapsed ? '' : ''
      )"
      :style="{
        width: isCollapsed ? `${themeStore.sidebarCollapsedWidth}px` : `${themeStore.sidebarWidth}px`
      }"
    >
      <div class="flex h-full flex-col">
        <!-- Logo -->
        <div class="flex h-14 items-center px-4 justify-center">
          <div class="w-9 h-9 bg-primary/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
            <Wind class="w-5 h-5 text-primary" />
          </div>
          <span v-if="!isCollapsed" class="text-xl font-bold ml-3 overflow-hidden whitespace-nowrap transition-all">
            BreezeAdmin
          </span>
        </div>

        <!-- Navigation -->
        <nav class="overflow-y-auto p-3 flex-1">
          <div class="space-y-1" :class="isCollapsed ? 'w-[56px]' : 'w-full'">
            <template v-for="item in navItems" :key="item.path">

              <!-- ==================== 收起状态 ==================== -->
              <template v-if="isCollapsed">
                <!-- 带子菜单的项 - 使用 Popover 浮层 -->
                <Popover
                  v-if="item.hasChildren"
                  :open="activePopover === item.path"
                  @update:open="(v: boolean) => activePopover = v ? item.path : null"
                >
                  <PopoverTrigger as-child>
                    <button
                      :class="cn(
                        'flex items-center justify-center rounded-lg p-2.5 transition-colors w-full',
                        'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                        isExactActive(item.path) && 'bg-accent text-accent-foreground',
                        isSubActive(item.path) && 'text-primary'
                      )"
                    >
                      <component :is="item.icon" class="h-5 h-5 shrink-0" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="right"
                    align="start"
                    :side-offset="8"
                    class="w-52 rounded-lg p-2"
                  >
                    <!-- 二级菜单 -->
                    <template v-for="level2 in item.children" :key="level2.path">
                      <!-- 二级有子菜单 - 展示为分组 -->
                      <div v-if="level2.hasChildren" class="py-1">
                        <div class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                          {{ level2.name }}
                        </div>
                        <RouterLink
                          v-for="level3 in level2.children"
                          :key="level3.path"
                          :to="level3.path"
                          @click="closePopover"
                          :class="cn(
                            'flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors',
                            'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                            isExactActive(level3.path) && 'bg-accent text-accent-foreground'
                          )"
                        >
                          <component :is="level3.icon" class="h-3.5 w-3.5 shrink-0" />
                          <span class="truncate">{{ level3.name }}</span>
                        </RouterLink>
                      </div>
                      <!-- 二级无子菜单 -->
                      <RouterLink
                        v-else
                        :to="level2.path"
                        @click="closePopover"
                        :class="cn(
                          'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors',
                          'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                          isExactActive(level2.path) && 'bg-accent text-accent-foreground'
                        )"
                      >
                        <component :is="level2.icon" class="h-4 w-4 shrink-0" />
                        <span class="truncate">{{ level2.name }}</span>
                      </RouterLink>
                    </template>
                  </PopoverContent>
                </Popover>

                <!-- 无子菜单的项 - 使用 Tooltip -->
                <Tooltip v-else>
                  <TooltipTrigger as-child>
                    <RouterLink
                      :to="item.path"
                      :class="cn(
                        'flex items-center justify-center rounded-lg p-2.5 transition-colors',
                        'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                        isExactActive(item.path) && 'bg-accent text-accent-foreground'
                      )"
                    >
                      <component :is="item.icon" class="h-5 w-5 shrink-0" />
                    </RouterLink>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {{ item.name }}
                  </TooltipContent>
                </Tooltip>
              </template>

              <!-- ==================== 展开状态 ==================== -->
              <template v-else>
                <!-- 带子菜单的项 -->
                <Collapsible v-if="item.hasChildren" :open="isExpanded(item)" @update:open="toggleExpand(item, navItems)">
                  <CollapsibleTrigger as-child>
                    <button
                      :class="cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors w-full',
                        'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                        isExactActive(item.path) && 'bg-accent text-accent-foreground',
                        isSubActive(item.path) && 'text-primary'
                      )"
                    >
                      <component :is="item.icon" class="h-5 w-5 shrink-0" />
                      <span class="flex-1 text-left truncate">{{ item.name }}</span>
                      <component :is="isExpanded(item) ? ChevronDown : ChevronRight" class="h-4 w-4 shrink-0 transition-transform duration-200" />
                    </button>
                  </CollapsibleTrigger>
                  <!-- 二级菜单 -->
                  <CollapsibleContent class="space-y-1 overflow-hidden">
                    <div class="mt-1 space-y-1">
                      <template v-for="level2 in item.children" :key="level2.path">
                        <!-- 带子菜单的二级项 -->
                        <Collapsible v-if="level2.hasChildren" :open="isExpanded(level2)" @update:open="toggleExpand(level2, item.children)">
                          <CollapsibleTrigger as-child>
                            <button
                              :class="cn(
                                'flex items-center gap-3 rounded-lg pl-9 pr-3 py-2 text-sm transition-colors w-full',
                                'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                isExactActive(level2.path) && 'bg-accent text-accent-foreground',
                                isSubActive(level2.path) && 'text-primary'
                              )"
                            >
                              <component :is="level2.icon" class="h-4 w-4 shrink-0" />
                              <span class="flex-1 text-left truncate">{{ level2.name }}</span>
                              <component :is="isExpanded(level2) ? ChevronDown : ChevronRight" class="h-4 w-4 shrink-0 transition-transform duration-200" />
                            </button>
                          </CollapsibleTrigger>
                          <!-- 三级菜单 -->
                          <CollapsibleContent class="space-y-1 overflow-hidden">
                            <div class="mt-1 space-y-1">
                              <RouterLink
                                v-for="level3 in level2.children"
                                :key="level3.path"
                                :to="level3.path"
                                :class="cn(
                                  'flex items-center gap-3 rounded-lg pl-12 pr-3 py-2 text-sm transition-colors w-full',
                                  'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                  isExactActive(level3.path) && 'bg-accent text-accent-foreground'
                                )"
                              >
                                <component :is="level3.icon" class="h-4 w-4 shrink-0" />
                                <span class="truncate">{{ level3.name }}</span>
                              </RouterLink>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                        <!-- 无子菜单的二级项 -->
                        <RouterLink
                          v-else
                          :to="level2.path"
                          :class="cn(
                            'flex items-center gap-3 rounded-lg pl-9 pr-3 py-2 text-sm transition-colors w-full',
                            'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                            isExactActive(level2.path) && 'bg-accent text-accent-foreground'
                          )"
                        >
                          <component :is="level2.icon" class="h-4 w-4 shrink-0" />
                          <span class="truncate">{{ level2.name }}</span>
                        </RouterLink>
                      </template>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                <!-- 无子菜单的项 -->
                <RouterLink
                  v-else
                  :to="item.path"
                  :class="cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    isExactActive(item.path) && 'bg-accent text-accent-foreground'
                  )"
                >
                  <component :is="item.icon" class="h-5 w-5 shrink-0" />
                  <span class="truncate">{{ item.name }}</span>
                </RouterLink>
              </template>
            </template>
          </div>
        </nav>
      </div>
    </aside>
  </TooltipProvider>
</template>
