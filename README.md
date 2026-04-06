<div align="center">

# 🌬️ BreezeAdmin

**轻量 · 高效 · 优雅** 的中后台管理系统解决方案

基于 Vue 3 + shadcn-vue + TypeScript 构建的高保真管理后台模板

### 👉 [在线演示](https://vue.breezeui.cn/) 👈

**账号：** `admin` / `admin123`

---

[![Vue 3](https://img.shields.io/badge/Vue-3.4-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![shadcn-vue](https://img.shields.io/badge/shadcn--vue-latest-000000?logo=shadcnui&logoColor=white)](https://www.shadcn-vue.com/)
[![Pinia](https://img.shields.io/badge/Pinia-2.x-FFD859)](https://pinia.vuejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

[在线演示](https://vue.breezeui.cn/) · [快速开始](#-快速开始) · [功能预览](#-功能特性) · [技术架构](#-技术栈) · [项目结构](#-项目结构)

</div>

---

## ✨ 功能特性

### 🎨 界面与交互

- 🌈 **主题系统** — 7 种预设主题色 + 自定义取色器，主/成功/警告/错误四色独立配置，信息色与前景色自动派生，CSS 变量实时注入，版本化持久化存储（v3）
- 🌙 **暗色模式** — 支持亮色 / 暗色 / 跟随系统三种模式，系统主题变化实时联动
- 📐 **布局定制** — 侧边栏宽度、底部栏高度、标签栏/面包屑/功能按钮等十余项开关均可实时调整
- 📑 **多标签页** — 支持拖拽排序、右键菜单（刷新/关闭/关闭其他）、持久化恢复
- 🧭 **多级导航** — 三级侧边栏菜单，手风琴展开，收起态 Popover 浮层，路由自动定位展开
- ⏳ **全局进度条** — 路由切换时的顶部加载进度指示
- 🏷️ **动态标签标题** — 浏览器标签页标题随路由自动更新

### 🔐 权限与安全

- 🛡️ **角色权限** — 基于角色的路由守卫（admin / manager / user），未授权自动重定向
- 🔑 **认证管理** — Token 持久化、登录态恢复、401 自动登出
- 📋 **细粒度权限码** — 10+ 权限码覆盖 8 大功能模块，按钮级别控制

### 📊 数据与展示

- 📈 **仪表盘** — 核心指标卡片 + 趋势图表 + 最近订单表格，带骨架屏加载态
- 🗂️ **数据表格** — 基于 TanStack Table 的查询表格，支持多条件筛选、分页、排序
- 📉 **图表可视化** — ECharts 5 集成，支持折线图、柱状图、饼图等
- 📤 **Excel 导出** — 一键导出数据为 Excel 文件

### 🛠️ 开发体验

- 🎭 **Mock 服务** — MSW 2 拦截全部 API，通过环境变量显式控制开关，开发环境零依赖后端
- 🦴 **骨架屏防抖** — 300ms 延迟展示，避免快速响应时的闪烁
- 🌍 **国际化** — vue-i18n 中/英双语，Composition API 模式
- 📦 **Bundle 分析** — rollup-plugin-visualizer 可视化打包产物
- 🔧 **代码规范** — ESLint + simple-git-hooks + lint-staged，提交前自动检查
- ⚡ **自动导入** — unplugin-auto-import + unplugin-vue-components，组件和 API 零手动导入

---

## 🛠️ 技术栈

<table>
<tr>
<td width="50%">

### 核心框架

| 技术 | 说明 |
|---|---|
| ![Vue](https://img.shields.io/badge/Vue-3.4-4FC08D?logo=vue.js&logoColor=white) | 渐进式 JavaScript 框架 |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white) | 类型安全的 JavaScript 超集 |
| ![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?logo=vite&logoColor=white) | 下一代前端构建工具 |

</td>
<td width="50%">

### UI 与样式

| 技术 | 说明 |
|---|---|
| ![shadcn-vue](https://img.shields.io/badge/shadcn_vue-latest-000000?logo=shadcnui&logoColor=white) | 高质量 Vue 组件集合 |
| ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white) | 原子化 CSS 框架 |
| ![Reka UI](https://img.shields.io/badge/Reka_UI-2.x-E57373) | 无样式 Headless 组件 |
| ![Lucide](https://img.shields.io/badge/Lucide_Icons-0.359-FF6F61) | 精美的开源图标库 |

</td>
</tr>
<tr>
<td width="50%">

### 数据与状态

| 技术 | 说明 |
|---|---|
| ![Pinia](https://img.shields.io/badge/Pinia-2.x-FFD859) | Vue 官方状态管理 |
| ![Alova](https://img.shields.io/badge/Alova-2.x-261D5A) | 轻量级请求策略库 |
| ![TanStack Table](https://img.shields.io/badge/TanStack_Table-8.x-FF4154) | 强大的表格解决方案 |
| ![Zod](https://img.shields.io/badge/Zod-3.x-3068B7) | TypeScript 优先的数据校验 |

</td>
<td width="50%">

### 工程化

| 技术 | 说明 |
|---|---|
| ![ESLint](https://img.shields.io/badge/ESLint-9.x-4B32C3?logo=eslint&logoColor=white) | 代码质量检查工具 |
| ![MSW](https://img.shields.io/badge/MSW-2.x-FF6B6B) | API Mock 服务 |
| ![ECharts](https://img.shields.io/badge/ECharts-5.x-AA344D) | 数据可视化图表库 |
| ![vue-i18n](https://img.shields.io/badge/vue_i18n-11-42b883) | Vue 国际化方案 |

</td>
</tr>
</table>

---

## 📂 项目结构

```
breeze-admin/
├── public/                  # 静态资源
├── src/
│   ├── api/                 # 🔌 API 接口层
│   │   └── modules/         #    按业务模块拆分（auth, dashboard, orders...）
│   ├── components/          # 🧩 组件
│   │   ├── ui/              #    shadcn-vue 基础组件
│   │   ├── layout/          #    布局组件（Sidebar, Header, TabsBar, Footer...）
│   │   └── dashboard/       #    仪表盘业务组件
│   ├── composables/         # 🪝 组合式函数
│   │   ├── use-tabs.ts      #    标签页路由同步
│   │   ├── use-color.ts     #    主题色转换
│   │   ├── use-progress.ts  #    全局进度条
│   │   └── use-tab-title.ts #    动态标签标题
│   ├── hooks/               # 🪝 自定义 Hooks（useExportExcel 等）
│   ├── lib/                 # 📚 工具库
│   │   ├── utils.ts         #    cn() 样式合并
│   │   ├── constants.ts     #    全局常量
│   │   └── router-helpers.ts#    路由元信息查找 + 面包屑构建
│   ├── locales/             # 🌍 国际化语言包（中/英）
│   ├── mocks/               # 🎭 MSW Mock 处理器
│   ├── router/              # 🧭 路由系统
│   │   ├── routes-config.ts #    集中式路由定义（单一数据源）
│   │   ├── guards.ts        #    认证 + 角色守卫
│   │   └── permissions.ts   #    权限校验
│   ├── stores/              # 📦 Pinia 状态仓库
│   │   ├── auth.ts          #    认证状态（持久化）
│   │   ├── theme.ts         #    主题配置（版本化持久化）
│   │   └── tabs.ts          #    标签页状态（拖拽排序 + 持久化）
│   ├── types/               # 📝 Zod Schema（全项目类型单一数据源）
│   ├── utils/               # 🔧 请求封装（Alova 实例 + 拦截器）
│   └── views/               # 📄 页面视图
│       ├── auth/            #    登录 / 忘记密码
│       ├── dashboard/       #    仪表盘
│       ├── orders/          #    订单管理
│       ├── form/            #    复杂表单
│       ├── query/           #    查询表格
│       └── system/          #    系统管理（请求日志/权限/超管）
├── ARCHITECTURE.md          # 📖 架构设计文档
├── tailwind.config.js       # Tailwind + shadcn-vue 主题配置
├── vite.config.ts           # Vite 构建配置
└── package.json
```

---

## 🚀 快速开始

### 环境要求

- ![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=node.js&logoColor=white)
- ![pnpm](https://img.shields.io/badge/pnpm-%3E%3D8-F69220?logo=pnpm&logoColor=white)

### 安装与运行

```bash
# 克隆项目
git clone <repository-url>
cd BreezeAdmin

# 安装依赖
pnpm install

# 启动开发服务器（默认端口 2018）
pnpm dev
```

### 常用命令

| 命令 | 说明 |
|---|---|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | TypeScript 检查 + 生产构建 |
| `pnpm preview` | 预览生产构建 |
| `pnpm typecheck` | 仅类型检查 |
| `pnpm lint` | ESLint 代码检查 |
| `pnpm analyze` | Bundle 产物可视化分析 |

---

## 🚢 部署到 Vercel（演示模式）

本项目支持一键部署到 Vercel，开启 Mock 模式后无需后端服务即可在线体验全部功能。

### 前置条件

- `msw` 放在 `dependencies`（非 `devDependencies`），确保生产构建包含 MSW
- `public/mockServiceWorker.js` 存在（MSW Service Worker 文件，Vite 构建时自动复制）
- `vercel.json` 配置了 SPA `rewrites` 规则，避免浏览器刷新 404

### 方式一：CLI 部署（推荐）

```bash
# 安装 Vercel CLI（如未安装）
npm i -g vercel

# 部署到生产环境
vercel --prod
```

### 方式二：GitHub 自动部署

1. Fork 或导入项目到 GitHub 仓库
2. 在 [Vercel Dashboard](https://vercel.com) 导入该项目，关联 GitHub 仓库
3. Production Branch 设为 `main`
4. 每次 push 到 `main` 自动触发部署

```bash
git push github main
```

### 环境变量配置

在 Vercel **Settings → Environment Variables** 中添加：

| 变量名 | 值 | 说明 |
|---|---|---|
| `VITE_ENABLE_MOCK` | `true` | 启用 MSW Mock 拦截 API 请求 |
| `VITE_SERVICE_BASE_URL` | *(留空)* | 留空时请求发到当前域名，由 MSW 拦截 |

> **注意**：`VITE_` 前缀变量在构建时静态注入，修改后需重新部署才能生效。

### vercel.json 说明

```json
{
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

`rewrites` 确保SPA History 模式路由在浏览器刷新时不会返回 404。

### 常见问题

| 问题 | 原因 | 解决方案 |
|---|---|---|
| 刷新页面 404 | 缺少 SPA 路由重写 | `vercel.json` 添加 `rewrites` |
| `VITE_ENABLE_MOCK` 为 `undefined` | 环境变量未配置 | 在 Vercel 环境变量中添加 |
| MSW 未启动 | 变量值含末尾空白字符 | 代码已用 `trim()` 处理 |
| 构建失败 TS 错误 | 分支缺少修复 | 确保 `main` 分支包含最新代码 |

### 注意事项

- Mock 模式仅适用于**演示和预览**，不适合生产环境
- 所有数据为模拟数据，刷新后丢失
- 如需接入真实后端：`VITE_ENABLE_MOCK` 设为 `false`，`VITE_SERVICE_BASE_URL` 指向实际 API 地址，并将 `package.json` 中的 `msw` 移回 `devDependencies`

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project)

---

## 🔑 测试账号

Mock 环境下内置三种角色的测试账号：

| 角色 | 用户名 | 密码 | 权限范围 |
|---|---|---|---|
| 👑 超级管理员 | `admin` | `admin123` | 全部功能 + 超管面板 |
| 👔 管理员 | `manager` | `manager123` | 大部分功能，无超管面板 |
| 👤 普通用户 | `user` | `user123` | 基础功能，无订单管理 |

---

## 🏗️ 架构设计

本项目采用分层架构，职责清晰：

```
┌─────────────────────────────────────────────┐
│                  Views                       │  页面视图层
├─────────────────────────────────────────────┤
│              Components                      │  组件层
├──────────┬──────────┬───────────────────────┤
│  Stores  │ Composables │    Router          │  状态 / 逻辑 / 路由
├──────────┴──────────┴───────────────────────┤
│                  API Modules                 │  接口层
├─────────────────────────────────────────────┤
│           Zod Schema (Types)                 │  类型定义层（单一数据源）
├─────────────────────────────────────────────┤
│             Alova (HTTP Client)              │  网络层
├─────────────────────────────────────────────┤
│              MSW (Mock Service)              │  Mock 层（环境变量控制开关）
└─────────────────────────────────────────────┘
```

> 详细的架构说明请参阅 [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 📜 许可证

本项目基于 [MIT License](./LICENSE) 开源。

© 2024 - Present BL
