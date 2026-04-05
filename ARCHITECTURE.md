# BreezeAdmin - Vue 3 企业管理后台系统架构文档

> 最后更新：2026-04-05 14:46

## 项目概述

**项目名称：** BreezeAdmin
**项目类型：** 中小型企业管理后台系统
**技术栈：** Vue 3 + TypeScript + Vite + shadcn-vue
**核心目标：** 基于shadcn-vue官方Dashboard示例实现高保真原型，包含真实布局、数据展示和交互逻辑

## 技术架构

### 核心技术栈

| 技术 | 说明 |
| ------ |------ |
| **Vue 3 + TypeScript** | Composition API, Strict Mode |
| **Vite** | 最新版本构建工具 |
| **pnpm** | 包管理器 |
| **shadcn-vue** | Tailwind CSS + reka-ui 组件库 |
| **alova** | HTTP Client + useRequest 状态管理 |
| **pinia + persistedstate** | 状态管理 + 持久化 |
| **vue-router** | 集中式 Meta 配置 + 手动路由（由于 `unplugin-vue-router` 与 vue-router 4.x 不兼容，采用折中方案） |
| **lucide-vue-next** | 图标库 |
| **echarts + vue-echarts** | 图表库 |
| **vorms** | 表单验证 |
| **clsx + tailwind-merge** | Class工具 |
| **@vueuse/core** | useDark（主题）、useLocalStorage等组合函数 |
| **unplugin-auto-import + unplugin-vue-components** | 自动导入 |
| **lint-staged + simple-git-hooks** | Git Hooks 自动化检查 |
| **msw** | API Mock 服务（开发环境无侵入式拦截） |
| **rollup-plugin-visualizer** | 构建产物分析 |
| **zod** | Schema 定义 + 类型推导 + 运行时校验 |

## 项目初始化

### Step 1: 创建项目

```
# 创建项目
npm create vite@latest breeze-admin -- --template vue-ts
cd breeze-admin

# 安装所有依赖
pnpm add vue-router pinia pinia-plugin-persistedstate alova lucide-vue-next \
  vormis clsx tailwind-merge \
  echarts vue-echarts class-variance-authority @vueuse/core zod

pnpm add -D tailwindcss postcss autoprefixer @vitejs/plugin-vue \
  typescript vue-tsc unplugin-auto-import unplugin-vue-components \
  @types/node lint-staged simple-git-hooks vue-tsc-files \
  msw rollup-plugin-visualizer

# 初始化 MSW Service Worker
pnpm msw init public --save

# 初始化 shadcn-vue
npx shadcn-vue@latest init -d -y

# 安装 shadcn-vue 组件
npx shadcn-vue@latest add button card input label dropdown-menu avatar \
  badge table tabs sheet skeleton separator breadcrumb form
```

## 核心配置文件

### Step 2: 配置核心文件

#### `vite.config.ts`

```
// 配置别名 @ -> src，自动导入 vue/pinia/router/lucide 图标
```

#### `tailwind.config.js`

```
colors: {
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))'
  },
  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))'
  },
  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))'
  },
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))'
  },
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))'
  },
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))'
  },
  popover: {
    DEFAULT: 'hsl(var(--popover))',
    foreground: 'hsl(var(--popover-foreground))'
  }
}
```

#### `tsconfig.json`

```
// 配置 strict: true，路径别名 @/*
```

#### `src/styles/globals.css`

```
/* 必须包含完整的 CSS 变量定义 */
```

#### `src/lib/utils.ts`

```
// cn() 函数（clsx + tailwind-merge）
```

#### `components.json`

```
{
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib"
  }
}
```

## Git Hooks 配置

### 配置 package.json

在 `package.json` 中添加以下配置：

```json
{
  "scripts": {
    "prepare": "simple-git-hooks"
  },
  "simple-git-hooks": {
    "pre-commit": "npx lint-staged"
  },
  "lint-staged": {
    "*.{js,ts,vue}": [
      "eslint --fix",
      "vue-tsc-files --noEmit"
    ]
  }
}
```

### 激活钩子

```bash
pnpm prepare
# 或重新安装依赖自动触发
pnpm install
```

### 提交流程

1. 执行 `git commit` 时自动触发 `lint-staged`
2. **自动修复**：ESLint 修复格式问题（缩进、分号、引号等）→ 继续提交
3. **阻断机制**：TypeScript 类型错误 → 阻止提交，强制修复

### 跳过检查（临时）

```bash
git commit --no-verify
```

## 项目目录结构

```
src/
├── api/
│   ├── index.ts              # 桶导出（authApi, dashboardApi, ordersApi, usersApi, queryApi）
│   └── modules/
│       ├── auth.ts            # login / getUserInfo / forgotPassword
│       ├── dashboard.ts       # getMetrics / getSalesTrend / getRecentOrders
│       ├── orders.ts          # getOrders
│       ├── users.ts           # getUsers
│       ├── query.ts           # getQueryRecords
│       ├── system.ts          # getRequestLogs / getPermissions / getAdminInfo / getAdminUsers
│       └── example.ts         # CRUD / 并发请求 / 错误模拟示例
├── components/
│   ├── ui/                   # shadcn-vue 组件 (Form, Input, Label, Switch, Tooltip, Collapsible 等)
│   ├── layout/               # Sidebar, Header, AppLayout, ThemeSettings, TabsBar, Footer, LoadingBar
│   └── dashboard/            # MetricCard, SalesChart, OrdersTable, + Skeletons
├── composables/
│   ├── use-tabs.ts           # Tab 栏与路由联动（初始化固定标签 + 路由监听）
│   ├── use-color.ts          # hex↔HSL 颜色转换（shadcn CSS 变量格式）
│   ├── use-progress.ts       # 全局进度条状态（start / finish / fail + 滴漏动画）
│   └── use-tab-title.ts      # 动态标签标题设置
├── hooks/                    # useExportExcel 等自定义 Hook
├── lib/
│   ├── utils.ts              # cn() 函数（clsx + tailwind-merge）
│   ├── constants.ts          # 全局常量
│   ├── icon-map.ts           # Lucide 图标名称→组件映射
│   └── router-helpers.ts     # 路由元信息查找 + 面包屑构建（O(1) 扁平化 Map）
├── mocks/
│   ├── handlers.ts           # MSW API 拦截规则（Schema 从 @/types/api-schema 导入）
│   └── browser.ts            # 浏览器端 MSW 配置
├── router/
│   ├── index.ts              # 路由入口 + LoadingBar 钩子（beforeEach/afterEach）
│   ├── routes-config.ts      # 集中式路由配置（路径 + 组件 + Meta 合一）
│   ├── types.ts              # AppRouteConfig / AppRouteMeta 类型定义
│   ├── permissions.ts        # hasPermission 角色权限判断
│   └── guards.ts             # 权限守卫（认证 + 角色白名单）
├── stores/
│   ├── auth.ts               # 认证状态（pinia-plugin-persistedstate 自动持久化）
│   ├── app.ts                # 应用状态（侧边栏、主题模式、语言）
│   ├── theme.ts              # 主题配置（颜色、布局、通用开关 + 版本化持久化）
│   └── tabs.ts               # 标签栏状态（tabs / activeTab / refreshKey + 拖拽排序 + 持久化）
├── types/
│   └── api-schema.ts         # 全量 Zod Schema + TypeScript 类型导出（唯一数据源）
├── utils/
│   └── request.ts            # 企业级 Alova 实例（拦截器 + BusinessError + 自动解包）
├── views/                    # 页面按功能模块划分
│   ├── auth/
│   │   ├── Login.vue
│   │   └── ForgotPassword.vue
│   ├── dashboard/
│   │   └── Dashboard.vue
│   ├── orders/
│   │   └── Orders.vue
│   ├── system/
│   │   ├── RequestManagement.vue
│   │   ├── SwitchPermissions.vue
│   │   ├── SuperAdmin.vue
│   │   └── RequestExamples.vue
│   ├── query/
│   │   └── QueryTable.vue
│   ├── form/
│   │   └── ComplexForm.vue
│   └── error/
│       └── Error404.vue
├── locales/
│   ├── en.ts                 # 英文翻译
│   └── zh.ts                 # 中文翻译
└── main.ts                   # 应用入口（Pinia + MSW(可选) + i18n + 路由）
```

## 核心功能实现

### Step 4: 核心代码实现

#### 4.1 Schema 层 — 唯一数据源 (`src/types/api-schema.ts`)

全量 Zod Schema 统一定义在此文件，**禁止在其他文件中重新定义 `z.object`**。

```typescript
// 枚举 Schema
export const UserRoleSchema = z.enum(['admin', 'manager', 'user'])
export const OrderStatusSchema = z.enum(['completed', 'pending', 'processing', 'cancelled'])

// 实体 Schema
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  avatar: z.string().nullable(),
  role: UserRoleSchema,
})

// 通过 z.infer 导出 TypeScript 类型
export type User = z.infer<typeof UserSchema>
export type OrderDetail = z.infer<typeof OrderDetailSchema>

// 登录响应（解包后的 data）
export const LoginDataSchema = z.object({
  token: z.string(),
  user: UserSchema,
})
export type LoginData = z.infer<typeof LoginDataSchema>

// 请求体 Schema
export const LoginRequestSchema = z.object({ username: z.string(), password: z.string() })
export const ForgotPasswordRequestSchema = z.object({ email: z.string().email() })
```

**类型导入红线**：所有 `.vue` 文件的类型必须写成 `import type { Xxx } from '@/types/api-schema'`，严禁从 `@/api/...` 导入类型。

#### 4.2 HTTP 客户端层 (`src/utils/request.ts`)

企业级 Alova 实例封装，职责：请求拦截 + 响应解包 + 错误处理 + 401 登出。

```typescript
// BusinessError 类 — 供业务 catch 块判断
export class BusinessError extends Error {
  code: number
  constructor(code: number, message: string) { ... }
}

// Token 读取 — 直接解析 localStorage JSON（pinia-plugin-persistedstate 格式）
// 不 import auth store，避免循环依赖
function getAuthToken(): string | null { ... }

// 401 处理 — 动态 import auth store，避免循环依赖
function handle401(): void { ... }

export const alovaInstance = createAlova({
  baseURL: import.meta.env.VITE_SERVICE_BASE_URL,
  beforeRequest(method) {
    // 注入 Authorization: Bearer <token>
    // POST/PUT/PATCH 自动注入 Content-Type: application/json
  },
  responded: (response) => {
    // HTTP 状态检查 → 401 登出 → JSON 解析 → 业务码检查 → 自动解包
    // json.code !== 200 → throw BusinessError(code, message)
    // return json.data  ← 业务组件直接拿到 data
  },
})
```

**响应拦截流程**：

```
HTTP response.ok?
  ├─ No → status 401? → 动态 import auth store → logout → 跳转 /login
  │       其他状态 → throw Error
  └─ Yes → response.json()
           ├─ json.code !== 200 → throw BusinessError(code, message)
           └─ return json.data  ← 自动解包，业务组件直接拿到 data
```

**关键设计**：
- Token 读取直接解析 `localStorage.getItem('auth')` JSON，不 import auth store
- 401 处理使用 `import('@/stores/auth')` 动态导入，避免循环依赖
- 响应自动解包：组件拿到的是 `json.data`，无需再 `.data.data`

#### 4.3 API 模块层 (`src/api/modules/`)

每个 API 模块对应一个业务域，方法签名即文档：

```typescript
// src/api/modules/auth.ts
import { alovaInstance } from '@/utils/request'
import type { LoginData, User } from '@/types/api-schema'

export const authApi = {
  login: (username: string, password: string) =>
    alovaInstance.Post<LoginData>('/api/auth/login', { username, password }),
  getUserInfo: () =>
    alovaInstance.Get<User>('/api/auth/userinfo'),
  forgotPassword: (email: string) =>
    alovaInstance.Post<void>('/api/auth/forgot-password', { email }),
}
```

**统一导出规范**（`src/api/index.ts`）：

```typescript
// 组件统一使用：import { authApi, dashboardApi } from '@/api'
export { authApi } from './modules/auth'
export { dashboardApi } from './modules/dashboard'
export { ordersApi } from './modules/orders'
export { usersApi } from './modules/users'
export { queryApi } from './modules/query'
```

#### 4.4 Mock 服务层 (`src/mocks/handlers.ts`)

MSW Mock Handlers，所有 Zod Schema 从 `@/types/api-schema` 统一导入。通过环境变量 `VITE_ENABLE_MOCK` 控制启用（`main.ts` 中判断 `VITE_ENABLE_MOCK === 'true'`）。

```typescript
import { LoginRequestSchema, ForgotPasswordRequestSchema } from '@/types/api-schema'

// 每个 handler 必须调用 delay() 模拟真实网络，防止页面闪烁
http.post('/api/auth/login', async ({ request }) => {
  await delay(Math.random() * 500 + 300)
  const body = await request.json()
  const result = LoginRequestSchema.safeParse(body)
  if (!result.success) return HttpResponse.json({ code: 400 }, { status: 400 })
  // ...
})
```

**强制规范**：每个 handler 返回前必须调用 `await delay(Math.random() * 500 + 300)`。

9 个 API handlers：login, userinfo, forgot-password, metrics, sales-trend, recent-orders, orders, users, query-records。

#### 4.5 Store层 (`src/stores/`)

- **auth.ts**: token, user, isAuthenticated, isAdmin, setAuth, logout, resetToken
  - 使用 `pinia-plugin-persistedstate` 自动持久化（`paths: ['token', 'user', 'tokenExpiry']`）
  - **禁止手动 localStorage 调用**（双重持久化已修复）
  - `User` 类型从 `@/types/api-schema` 导入
- **app.ts**: sidebarCollapsed, theme, language
- **theme.ts**: 主题配置中心，管理颜色 / 布局 / 通用开关三大模块
  - 颜色：primaryColor, successColor, warningColor, errorColor（通过 CSS 变量 `--primary` / `--success` / `--warning` / `--destructive` 注入）
  - 布局：showTabsBar, tabsKeepAlive, tabsMiddleClickClose, showBreadcrumb, showBreadcrumbIcon, sidebarWidth, sidebarCollapsedWidth, showFooter, footerHeight
  - 通用：showLanguageBtn, showThemeBtn, showFullscreenBtn
  - 持久化版本控制（`THEME_STORE_VERSION`），版本不兼容时自动清除旧缓存
- **tabs.ts**: 标签栏状态管理
  - tabs 数组（path / name / title / titleKey / icon / affix / closable / dynamicTitle）
  - activeTab / refreshKey（递增触发 RouterView 重渲染）
  - 操作：addTab, removeTab, setActiveTab, closeOtherTabs, closeLeftTabs, closeRightTabs, sortTabs, refreshCurrentTab, updateDynamicTitle
  - 使用 `pinia-plugin-persistedstate` 持久化（`paths: ['tabs', 'activeTab']`）
  - 初始化时从路由配置读取 `meta.affix` 补全固定标签

#### 4.6 路由层 (`src/router/`)

采用 **集中式配置** 策略，将路由 Meta 信息与组件完全分离，为未来后端驱动菜单平滑迁移做准备。

##### 4.6.1 目录结构

```
src/router/
├── index.ts           # 路由入口 + LoadingBar 进度条钩子
├── routes-config.ts   # 集中式路由配置（路径 + 组件 + Meta 合一）
├── types.ts           # AppRouteConfig / AppRouteMeta 类型定义
├── permissions.ts     # hasPermission 角色权限判断
└── guards.ts          # 权限守卫（认证 + 角色白名单）
```

##### 4.6.2 类型定义 (`src/types/router.d.ts`)

```typescript
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** i18n key, e.g. 'nav.dashboard' */
    title: string
    /** Lucide icon name */
    icon?: string
    /** Allowed roles for access control */
    roles?: string[]
    /** Hide from sidebar menu */
    hidden?: boolean
    /** Whether authentication is required (default: true) */
    requiresAuth?: boolean
    /** Whether to pin this tab in tags view */
    affix?: boolean
  }
}
```

##### 4.6.3 集中式配置 (`src/router/routes-config.ts`)

```typescript
export interface AppRouteConfig {
  path: string
  meta: {
    title: string
    icon?: string
    roles?: string[]
    hidden?: boolean
    requiresAuth?: boolean
    affix?: boolean
  }
}

// 集中式路由元信息配置
export const ROUTES_META: AppRouteConfig[] = [
  { path: '/login', meta: { title: 'nav.login', requiresAuth: false } },
  { path: '/dashboard', meta: { title: 'nav.dashboard', icon: 'LayoutDashboard', affix: true } },
  { path: '/orders', meta: { title: 'nav.orders', icon: 'ShoppingCart', roles: ['admin', 'manager'] } },
  { path: '/users', meta: { title: 'nav.users', icon: 'Users', roles: ['admin'] } },
  { path: '/complex-form', meta: { title: 'nav.complexForm', icon: 'FormInput' } }
]

// 预留：未来接收后端菜单数据的入口
export const DYNAMIC_ROUTES_META: AppRouteConfig[] = []

export function mergeDynamicRoutes(routes: AppRouteConfig[]) {
  DYNAMIC_ROUTES_META.push(...routes)
}
```

##### 4.6.4 路由入口 (`src/router/index.ts`)

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes-config'
import { authGuard } from './guards'
import { useProgress } from '@/composables/use-progress'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(authGuard)

// LoadingBar 进度条钩子 — 仅在路径真正变化时触发
const { start, finish } = useProgress()
router.beforeEach((to, from) => {
  if (to.path !== from.path) start()
})
router.afterEach(() => finish())

export default router
```

##### 4.6.5 权限守卫 (`src/router/guards.ts`)

```typescript
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export const authGuard = (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth !== false) {
    if (!authStore.isAuthenticated) {
      next('/login')
      return
    }

    if (to.meta.roles && Array.isArray(to.meta.roles)) {
      const userRole = authStore.user?.role
      if (userRole && !to.meta.roles.includes(userRole)) {
        next('/dashboard')
        return
      }
    }
  }

  if (to.path === '/login' && authStore.isAuthenticated) {
    next('/dashboard')
    return
  }

  next()
}
```

##### 4.6.6 侧边栏集成 (`src/components/layout/Sidebar.vue`)

从路由 meta 动态读取菜单配置。

##### 4.6.7 i18n 集成规范

- **title 字段必须使用 i18n key**，严禁硬编码中英文字符串
- i18n key 格式：`'nav.{page}'`（例如 `'nav.dashboard'`, `'nav.orders'`）
- 翻译文件位于 `src/locales/en.ts` 和 `src/locales/zh.ts`

##### 4.6.8 路径匹配规则

| 场景 | 匹配方式 | 示例 |
|------|----------|------|
| 精确匹配 | `ROUTES_META.path === route.path` | 配置 `/orders`，路由 `/orders` |
| 前缀匹配 | `route.path.startsWith(config.path + '/')` | 配置 `/orders`，路由 `/orders/:id` |

**优先级**：精确匹配 > 前缀匹配

##### 4.6.9 后端驱动菜单预留

通过 `mergeDynamicRoutes()` 函数预留扩展接口：

```typescript
// 未来后端返回菜单数据后
import { mergeDynamicRoutes } from '@/router/routes-config'

const backendMenu = await fetchMenuAPI()
mergeDynamicRoutes(backendMenu)  // 合并到动态路由表
```

#### 4.7 表单层 - 使用vorms

使用vorms配合shadcn-vue的Form组件。

#### 4.8 布局层 (`src/components/layout/`)

- **AppLayout.vue**: 主布局容器，Desktop Sidebar + Mobile Sheet + Header + TabsBar + RouterView + Footer
  - `routerViewKey = route.path + refreshKey`，支持标签刷新（递增 key 触发 RouterView 重渲染）
  - `<Transition name="slide-fade">` 页面切换动画
  - `<KeepAlive>` 可选启用（由 `themeStore.tabsKeepAlive` 控制）
- **LoadingBar.vue**: 顶部进度条组件（fixed, z-index: 9999）
  - 使用 `useProgress()` 共享状态（单例模式）
  - 滴漏动画：30% 起步 → 随机增量趋近 95% → 完成时 100% → 300ms 后归零
  - 防闪烁：最少展示 300ms
  - 失败态：`--destructive` 红色 + 阴影
  - `active` 标志位：`finish()` 在 `start()` 未调用时直接 return，防止同路径导航误触发
- **Sidebar.vue**: Logo, 导航菜单（Lucide图标），根据用户角色过滤菜单
  - 展开态：手风琴式 Collapsible（`expandedMenus` 状态管理）
  - 收起态：Tooltip + Popover 浮层
  - 自动展开当前菜单分支（`watch(route.path)` 驱动）
- **Header.vue**: 面包屑 + 全屏切换 + 主题切换 + 多语言 + 通知 + 用户菜单
  - 面包屑使用 `buildBreadcrumbs(route.path)` 从扁平化路由 Map O(1) 构建
  - 根路径 `/`（Dashboard）特殊处理：直接查 `pathMap.get('/')` 获取元信息
- **TabsBar.vue**: 多标签页管理
  - 拖拽排序（vuedraggable）
  - 右键菜单：刷新 / 关闭 / 关闭左侧 / 关闭右侧 / 关闭其他
  - 中键点击关闭标签（由 `themeStore.tabsMiddleClickClose` 控制）
  - 双击关闭可关闭标签
  - 滚动按钮 + 鼠标滚轮横向滚动
  - 下拉菜单快速切换标签（DropdownMenu）
  - 点击已激活标签无操作（避免误触刷新和页面动画）
- **Footer.vue**: 底部信息栏，高度由 `themeStore.footerHeight` 控制
- **ThemeSettings.vue**: 主题设置面板（Sheet 右侧抽屉）

#### 4.9 Dashboard组件 (`src/components/dashboard/`)

- **MetricCard.vue**: 指标卡片，显示数值、图标、环比涨跌
- **MetricCardSkeleton.vue**: 利用Skeleton组件，数据加载时展示占位动画
- **SalesChart.vue**: 使用echarts + vue-echarts展示趋势
- **OrdersTable.vue**: Table组件展示订单列表，状态Badge
- **OrdersTableSkeleton.vue**: Table行骨架屏，加载时展示占位行

#### 4.10 主题系统 (`src/stores/theme.ts` + `src/composables/use-color.ts`)

主题系统提供运行时颜色切换、布局参数调整和功能开关控制，所有配置通过 `pinia-plugin-persistedstate` 持久化到 `localStorage`。

##### 4.10.1 架构概览

```
┌──────────────────────────────────────────────────────────────┐
│              ThemeSettings.vue（设置面板，Sheet 侧栏）           │
│  预设色板 / 自定义颜色 / 布局开关 / 通用开关                      │
│  v-model 绑定 computed → themeStore 双向同步                    │
└────────────────────────┬──────────────────────────────────────┘
                         │ 读写
                         ▼
┌──────────────────────────────────────────────────────────────┐
│              themeStore (Pinia, key: theme-config)            │
│  ┌──────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│  │ 暗色模式      │  │ 布局配置          │  │ 通用配置        │  │
│  │ isDark       │  │ showTabsBar       │  │ showLanguageBtn│  │
│  │ themeMode    │  │ tabsKeepAlive     │  │ showThemeBtn   │  │
│  │ toggleTheme  │  │ tabsMiddleClick.. │  │ showFullscreen │  │
│  │ setTheme     │  │ showBreadcrumb    │  └────────────────┘  │
│  └──────────────┘  │ showBreadcrumbIcon│                      │
│  ┌─────────────┐   │ sidebarWidth      │  persist → localStorage│
│  │ 颜色配置     │   │ sidebarCollapsedW │  版本化：THEME_STORE_VERSION │
│  │ primaryColor│   │ showFooter        │  beforeRestore: 版本检测 │
│  │ successColor│   │ footerHeight      │  afterRestore: 默认值回填│
│  │ warningColor│   └──────────────────┘  + 旧 app 键迁移     │
│  │ errorColor  │                                              │
│  └──────┬──────┘                                              │
│         │  applyColors()  +  applyLayout()                    │
└─────────┼────────────────────────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────────────────────────────┐
│              CSS 变量注入（document.documentElement）            │
│                                                               │
│  颜色变量（applyColors）:                                        │
│  --primary          ← primaryColor                            │
│  --primary-foreground ← computeForeground(primaryColor)       │
│  --ring             ← primaryColor                            │
│  --info             ← computeInfoColor(primaryColor)          │
│  --info-foreground  ← computeForeground(primaryColor)         │
│  --success          ← successColor                            │
│  --success-foreground ← computeForeground(successColor)       │
│  --warning          ← warningColor                            │
│  --warning-foreground ← computeForeground(warningColor)       │
│  --destructive      ← errorColor                              │
│  --destructive-foreground ← computeForeground(errorColor)     │
│                                                               │
│  布局变量（applyLayout）:                                        │
│  --sidebar-width          ← sidebarWidth                      │
│  --sidebar-collapsed-width← sidebarCollapsedWidth             │
│  --footer-height          ← footerHeight                      │
│                                                               │
│  使用：hsl(var(--primary)) → Tailwind bg-primary / text-primary│
└──────────────────────────────────────────────────────────────┘
```

##### 4.10.2 颜色系统 (`src/composables/use-color.ts`)

| 函数 | 输入 | 输出 | 用途 |
|------|------|------|------|
| `hexToHsl(hex)` | `#3b82f6` | `"221.2 83.2% 53.3%"` | 转 shadcn CSS 变量格式 |
| `hexToHslObject(hex)` | `#3b82f6` | `{ h: 221.2, s: 83.2, l: 53.3 }` | 中间计算 |
| `computeInfoColor(hex)` | `#3b82f6` | `"221.2 83.2% 68.3%"` | 信息色 = 主色亮度 +15%（上限 80%） |
| `computeForeground(hex)` | `#3b82f6` | `"222.2 84% 4.9%"` 或 `"210 40% 98%"` | 根据背景色亮度自动选择深/浅前景色 |

**设计要点**：
- CSS 变量存储纯 HSL 值（如 `221.2 83.2% 53.3%`），Tailwind 通过 `hsl(var(--primary))` 引用
- 信息色自动从主色派生（亮度 +15%，上限 80%），用户无需手动配置
- 前景色自动适配：亮度 > 50% 使用深色前景，否则使用浅色前景，确保文字可读性
- 预设色板提供 7 种主题色（blue / violet / fuchsia / rose / orange / emerald / cyan），支持自定义颜色选择器

##### 4.10.3 暗色模式

暗色模式通过 `@vueuse/core` 的 `useDark` + `usePreferredDark` 实现，支持三种切换模式：

```typescript
const isDark = useDark({ storage: { /* 不写入 localStorage，由 persist 统一管理 */ } })
const preferredDark = usePreferredDark()
const themeMode = ref<'light' | 'dark' | 'system'>('system')
```

| 方法 | 行为 |
|------|------|
| `toggleTheme()` | 切换亮/暗（直接反转 `isDark`） |
| `setTheme(mode)` | `'light'` / `'dark'` / `'system'`，system 模式跟随系统偏好 |

**系统主题联动**：`watch(preferredDark)` 监听系统主题变化，当 `themeMode === 'system'` 时自动同步。

**持久化注意**：`useDark` 的 `storage` 被置空（`setItem: () => {}`），由 Pinia `persist.paths` 统一管理 `isDark` 和 `themeMode` 的持久化，避免双重写入。

##### 4.10.4 持久化与版本迁移

```typescript
const THEME_STORE_VERSION = 3
const THEME_STORAGE_KEY = 'theme-config'

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
    // 版本不兼容（无 _version 或旧版本）→ 清除旧缓存
  },
  afterRestore: (ctx) => {
    // 1. 默认值回填：缺失字段用 DEFAULT_COLORS/DEFAULT_LAYOUT/DEFAULT_GENERAL 补全
    // 2. 迁移：从旧 'app' 键读取 isDark/themeMode（兼容旧版本 store 结构）
  },
}
```

**版本迁移策略**：
- 升级 `THEME_STORE_VERSION` 即可触发旧缓存清理
- `afterRestore` 确保新增字段的向后兼容
- `initTheme()` 在首次启动时写入版本号，并调用 `applyColors()` + `applyLayout()` 初始化 CSS 变量

##### 4.10.5 主题设置面板 (`src/components/layout/ThemeSettings.vue`)

使用 shadcn-vue `Sheet` 组件实现右侧抽屉面板，分为三大区域：

| 区域 | 控件 | 组件 |
|------|------|------|
| 外观 | 预设色板（7色 + 自定义）、主/成功/警告/错误颜色选择器、重置按钮 | `<button>`, `<input type="color">` |
| 布局 | 标签栏开关×3、面包屑开关×2、侧边栏宽度滑块×2、底部开关+高度滑块 | `<Switch>`, `<input type="range">` |
| 通用 | 多语言/主题/全屏按钮开关×3 | `<Switch>` |

**重要**：Switch 组件底层为 reka-ui `SwitchRoot`，使用 `v-model`（绑定 `modelValue`），**不是** `v-model:checked`。

##### 4.10.6 布局集成

所有布局组件均从 `themeStore` 读取配置并实时响应：

| 组件 | 使用的主题配置 |
|------|--------------|
| `AppLayout.vue` | `sidebarWidth`, `sidebarCollapsedWidth`, `showFooter`, `footerHeight`；调用 `initTheme()` 初始化 |
| `Header.vue` | `showBreadcrumb`, `showBreadcrumbIcon`, `showLanguageBtn`, `showThemeBtn`, `showFullscreenBtn` |
| `Sidebar.vue` | `sidebarWidth`, `sidebarCollapsedWidth` |
| `TabsBar.vue` | `showTabsBar`, `tabsKeepAlive`, `tabsMiddleClickClose` |
| `Footer.vue` | `showFooter`, `footerHeight` |

#### 4.11 骨架屏防抖处理

使用 `@vueuse/core` 的 `useTimeoutFn` 实现 300ms 防抖：

```typescript
import { useTimeoutFn } from '@vueuse/core'

// 骨架屏防抖控制
const showMetricSkeletons = ref(false)

const { start: startMetricTimer, stop: stopMetricTimer } = useTimeoutFn(() => {
  showMetricSkeletons.value = true
}, 300)

// 请求开始时启动定时器
startMetricTimer()

// 数据返回后停止定时器并隐藏骨架屏
stopMetricTimer()
showMetricSkeletons.value = false
```

**规则**：只有当数据请求超过 300ms 才显示骨架屏，避免接口响应过快时闪烁。

#### 4.12 页面层 (`src/views/`)

所有页面统一使用模块化 API + 响应解包模式：

```typescript
// ✅ 正确写法（重构后）
import { authApi } from '@/api'
import { BusinessError } from '@/utils/request'
import type { LoginData } from '@/types/api-schema'

const loginRequest = useRequest(
  (values) => authApi.login(values.username, values.password),
  { immediate: false }
)

// 拦截器已自动解包，data.value 直接是 LoginData
// BusinessError 在 catch 块中判断业务错误
try {
  const data = await loginRequest.send(formValues)
  authStore.setAuth(data as unknown as LoginData, rememberMe.value)
} catch (err) {
  if (err instanceof BusinessError) {
    errorMessage.value = err.message
  }
}
```

```typescript
// ❌ 旧写法（已废弃）
import { alovaInstance } from '@/api/alova'

const request = useRequest(
  () => alovaInstance.Get<{ code: number; data: Order[] }>('/api/orders'),
  { immediate: false }
)
// 需要手动 response.code === 200 检查
// 数据访问需 response.data.value.data（多一层嵌套）
```

## API 层架构图

```
┌─────────────────────────────────────────────────────────┐
│                    Vue 页面 (.vue)                       │
│  import { xxxApi } from '@/api'                         │
│  import type { Xxx } from '@/types/api-schema'          │
│  import { BusinessError } from '@/utils/request'        │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              API 模块层 (src/api/modules/)               │
│  authApi / dashboardApi / ordersApi / usersApi / queryApi│
│  泛型签名即文档，返回解包后的数据类型                        │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│            Alova 实例 (src/utils/request.ts)             │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ beforeRequest│  │  responded   │  │ BusinessError │  │
│  │ Token 注入   │→ │ HTTP 检查    │→ │ 业务码异常    │  │
│  │ Content-Type │  │ 业务码检查   │  │ code+message  │  │
│  └──────────────┘  │ 自动解包data │  └───────────────┘  │
│                    └──────┬───────┘                     │
└───────────────────────────┼─────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼                             ▼
┌─────────────────────┐     ┌─────────────────────────────┐
│  MSW Mock Handlers   │     │   真实后端 API（生产环境）   │
│  (开发环境拦截)       │     │   http://localhost:2018      │
│  Schema 从统一导入    │     └─────────────────────────────┘
│  每个请求含 delay()   │
└─────────────────────┘

┌─────────────────────────────────────────────────────────┐
│          Schema 唯一数据源 (src/types/api-schema.ts)      │
│  Zod Schema → z.infer → TypeScript 类型                  │
│  被 API 模块 / Mock Handlers / Vue 页面 共同引用          │
└─────────────────────────────────────────────────────────┘
```

## 强制规范检查项

| 规则 | 检查命令 |
|---|---|
| 类型只从 `@/types/api-schema` 导入 | `grep -rn "import type.*from.*@/api" src/views/` 应为空 |
| 无直接 alovaInstance 调用（views 中） | `grep -rn "alovaInstance" src/views/` 应为空 |
| Auth store 无手动 localStorage | `grep "localStorage" src/stores/auth.ts` 仅含 persist 配置和注释 |
| Mock 无重复 z.object | `grep "z\.object" src/mocks/handlers.ts` 应为空 |
| BusinessError 在 request.ts 中定义导出 | `grep "export class BusinessError" src/utils/request.ts` 非空 |
| 每个 MSW handler 包含 delay | 每个 handler 函数体内含 `delay(` |

## 环境变量配置

项目采用 Vite 标准环境文件分层方案，文件名严格匹配 Vite 模式自动加载机制：

### 文件结构

| 文件 | 加载时机 | 用途 | 是否提交 |
|------|---------|------|---------|
| `.env` | 所有环境 | 全局共享变量（应用标题、基础路径） | ✅ 提交 |
| `.env.development` | `vite` (mode=development) | 开发环境 API 地址 | ✅ 提交 |
| `.env.production` | `vite build` (mode=production) | 生产环境 API 地址 | ✅ 提交 |
| `.env.local` | 当前环境，优先级最高 | 本地覆盖（含敏感信息） | ❌ 不提交 |
| `.env.*.local` | 对应模式的本地覆盖 | 模式特定的本地配置 | ❌ 不提交 |

### 环境变量清单

| 变量 | `.env` | `.env.development` | `.env.production` |
|------|--------|-------------------|------------------|
| `VITE_APP_TITLE` | `BreezeAdmin` | — | — |
| `VITE_BASE_URL` | `/` | — | — |
| `VITE_SERVICE_BASE_URL` | — | `http://localhost:2018` | `https://api.example.com` |
| `VITE_ENABLE_MOCK` | — | `true` | `false` |

### TypeScript 类型声明 (`src/env.d.ts`)

自定义 `VITE_*` 变量已通过 `ImportMetaEnv` 接口声明，提供 IDE 自动补全和类型检查：

```typescript
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_BASE_URL: string
  readonly VITE_SERVICE_BASE_URL: string
  readonly VITE_ENABLE_MOCK: string
}
```

### 加载优先级

```
.env.local > .env.{mode}.local > .env.{mode} > .env
```

**注意**：`.env.local` 和 `.env.*.local` 已在 `.gitignore` 中排除，用于存放敏感配置（API 密钥、真实 token 等），不会被提交到仓库。

## 构建产物分析

### 配置构建分析

在 `vite.config.ts` 中集成 `rollup-plugin-visualizer`：

```typescript
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const plugins = [...]

  // 仅在 analyze 模式下启用
  if (env.VITE_ANALYZE === 'true') {
    plugins.push(visualizer({
      filename: 'stats.html',
      open: true,
      gzipSize: true
    }))
  }

  return { plugins, ... }
})
```

### 添加环境变量

创建 `.env.analyze` 文件：

```
VITE_ANALYZE=true
```

### 执行分析

```bash
# 生成分析报告
pnpm analyze

# 访问 http://localhost:5173/stats.html 查看可视化报告
```

## 项目启动与验证

### Step 5: 启动验证

```
pnpm dev
# 访问 http://localhost:5173
# 使用 admin/admin123 登录
# 查看 Dashboard 数据展示
```

### 关键验证点

1. 运行 `pnpm dev` 启动开发服务器
2. 访问 `/login` 登录页，输入 admin/admin123
3. 验证跳转到 `/dashboard`
4. 确认指标卡片、图表、订单表格正常显示
5. 验证侧边栏导航、主题切换功能
6. 验证刷新后登录状态保持（持久化）
7. 切换到 Orders / UserManagement / QueryTable 页面验证数据加载
8. 验证忘记密码功能（Sheet 弹窗）
9. 控制台无报错

## 关键文件清单

1. `src/types/api-schema.ts` - 全量 Zod Schema 唯一数据源
2. `src/utils/request.ts` - 企业级 Alova 实例（拦截器 + BusinessError + 自动解包）
3. `src/api/index.ts` - API 模块桶导出
4. `src/api/modules/*.ts` - 模块化 API 定义
5. `src/stores/auth.ts` - 认证状态 + pinia-plugin-persistedstate 自动持久化
6. `src/stores/theme.ts` - 主题配置（颜色/布局/通用）+ 版本化持久化 + CSS 变量注入
7. `src/composables/use-color.ts` - hex↔HSL 颜色转换工具（shadcn CSS 变量格式）
8. `src/components/layout/ThemeSettings.vue` - 主题设置面板（Sheet 抽屉）
9. `src/mocks/handlers.ts` - MSW Mock 服务（Schema 统一导入）
10. `src/router/index.ts` - 路由入口，集成守卫
11. `src/components/layout/AppLayout.vue` - 布局系统

## 项目总结

BreezeAdmin 项目采用现代化的技术栈组合，通过 shadcn-vue 实现高保真的 UI 设计，结合 alova 和 pinia 构建高效的状态管理，使用 echarts 提供强大的数据可视化能力。API 层采用企业级架构：Zod Schema 单一数据源 + 模块化 API 定义 + 响应自动解包 + BusinessError 错误处理 + 401 自动登出，确保类型安全和开发体验。项目结构清晰，功能完整，适合中小型企业管理后台的快速开发和迭代。
