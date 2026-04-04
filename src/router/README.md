# 路由架构说明

## 架构概述

本项目采用 **集中式配置 + 手动路由** 的方案。

> 放弃 `unplugin-vue-router` 的原因：它与 vue-router 4.x 存在不兼容性，且文件系统路由难以与后端驱动菜单平滑对接。因此采用"配置即路由"的集中式方案，路由元信息（title、icon、roles 等）与页面组件分离。

## 目录结构

```
src/router/
├── index.ts           # 路由入口：createRouter + 挂载 authGuard
├── routes-config.ts   # 单一数据源：完整路由配置（支撑路由注册 + 菜单渲染）
├── routes.ts          # 转换层：将 AppRouteConfig[] 递归生成 RouteRecordRaw[]
├── guards.ts          # 全局前置守卫：认证检查 + 角色权限检查
├── permissions.ts     # 纯函数工具：hasPermission、filterRoutesByPermission 等
├── types.ts           # 类型定义：AppRouteConfig、AppRouteMeta、MenuItem
└── README.md          # 本文件
```

## 核心文件职责

### 1. routes-config.ts

**这是唯一的配置入口。** 所有路由和侧边栏菜单都来源于 `ROUTES_META` 数组。

配置示例：

```typescript
{
  path: '/',
  name: 'AppLayout',
  component: () => import('@/components/layout/AppLayout.vue'),
  meta: { requiresAuth: true },
  children: [
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/Dashboard.vue'),
      meta: {
        title: 'nav.dashboard',
        icon: 'LayoutDashboard',
        affix: true
      }
    },
    {
      path: 'system',
      name: 'System',
      redirect: '/system/settings',
      meta: {
        title: 'nav.system',
        icon: 'Settings',
        roles: ['admin']
      },
      children: [
        {
          path: 'permissions',
          name: 'Permissions',
          meta: {
            title: 'nav.permissions',
            icon: 'Shield'
          },
          children: [
            {
              path: 'roles',
              name: 'Roles',
              component: () => import('@/views/system/Roles.vue'),
              meta: { title: 'nav.roles', icon: 'UserCog' }
            }
          ]
        }
      ]
    }
  ]
}
```

关键规则：
- `path` 在 `children` 中使用**相对路径**（如 `dashboard`、`system/permissions/roles` 的 `"roles"`）。
- `title` 必须使用 i18n key（如 `nav.dashboard`）。
- `icon` 使用 `lucide-vue-next` 的图标名称。
- `roles` 控制角色白名单，空数组/undefined 表示全部可访问。
- `requiresAuth: false` 用于登录页等开放页面。
- `redirect` 支持字符串重定向。
- `affix` 用于**未来的 Tags View（多标签页）**功能。`affix: true` 表示该页面在标签栏中固定展示、不可关闭（类似 Dashboard 首页）。当前项目尚未实现 Tags View，因此该字段暂不起作用，仅作为预留。

### 2. routes.ts

`generateRoute` 函数递归遍历 `ROUTES_META`，将其转换为 vue-router 标准的 `RouteRecordRaw`。

**注意**：children 递归时不再追加父路径前缀（因为 vue-router 会自动拼接），只保留配置的相对 path：

```typescript
route.children = config.children.map(child => generateRoute(child, ''))
```

### 3. guards.ts

全局前置守卫 `authGuard` 的执行顺序：

1. **认证检查**：若 `requiresAuth !== false` 且未登录 → `/login`
2. **权限检查**：若 `meta.roles` 存在且当前用户角色不匹配 → `/dashboard`
3. **登录页拦截**：已登录用户访问 `/login` → `/dashboard`

### 4. permissions.ts

- `hasPermission(roles, userRole)`：基础权限判断
- `filterRoutesByPermission(routes, userRole)`：整棵树按角色过滤

### 5. Sidebar.vue

侧边栏从 `ROUTES_META` 动态读取菜单，递归渲染到三级。菜单链接生成逻辑：

```typescript
const fullPath = parentPath ? `${parentPath}/${child.path}` : `/${child.path}`
```

确保所有链接都是**绝对路径**。

---

## 如何新增一个路由页面

### 第一步：创建页面组件

在 `src/views/` 下新建 `.vue` 文件。根据功能选择目录：

```
src/views/users/Profile.vue       # 用户资料页
src/views/reports/SalesReport.vue # 销售报表页
```

### 第二步：配置路由

在 `src/router/routes-config.ts` 的 `ROUTES_META` 中新增配置。建议找到同级目录附近插入，保持结构清晰。

#### 示例 1：新增一个平级页面 `/reports`

在 `AppLayout` 的 `children` 里添加：

```typescript
{
  path: 'reports',
  name: 'Reports',
  component: () => import('@/views/reports/Reports.vue'),
  meta: {
    title: 'nav.reports',
    icon: 'BarChart3',
    roles: ['admin', 'manager']
  }
}
```

#### 示例 2：在三级菜单下新增页面 `/system/permissions/users`

在 `permissions` 的 `children` 里添加：

```typescript
{
  path: 'users',
  name: 'PermissionUsers',
  component: () => import('@/views/system/PermissionUsers.vue'),
  meta: {
    title: 'nav.permissionUsers',
    icon: 'UserCheck'
  }
}
```

> 三级及以下保持 `path` 为**相对路径**（如 `"users"`），vue-router 会自动拼接为 `/system/permissions/users`。

### 第三步：添加翻译

打开 `src/locales/zh.ts` 和 `src/locales/en.ts`，在 `nav` 对象下添加对应的 key：

```typescript
// zh.ts
nav: {
  // ...
  reports: '报表中心',
  permissionUsers: '权限用户'
}

// en.ts
nav: {
  // ...
  reports: 'Reports',
  permissionUsers: 'Permission Users'
}
```

### 第四步：添加图标（如需要）

打开 `src/components/layout/Sidebar.vue`，在 `iconMap` 中注册图标组件：

```typescript
import { BarChart3, UserCheck } from 'lucide-vue-next'

const iconMap: Record<string, Component> = {
  // ...
  BarChart3,
  UserCheck
}
```

> 如果图标已在 `iconMap` 中，可跳过此步。

### 第五步：验证

1. 启动 dev server：`pnpm dev`
2. 侧边栏能看到新菜单项
3. 点击跳转正常，无 404
4. 若配置了 `roles`，用不同角色账号验证权限控制

---

## 后端驱动菜单（预留扩展）

`routes-config.ts` 已预留动态路由入口：

```typescript
export const DYNAMIC_ROUTES_META: AppRouteConfig[] = []

export function mergeDynamicRoutes(routes: AppRouteConfig[]) {
  DYNAMIC_ROUTES_META.push(...routes)
}
```

未来接入后端菜单时，只需调用 `mergeDynamicRoutes(backendMenu)`，然后执行路由动态添加（vue-router 的 `addRoute`）即可。
