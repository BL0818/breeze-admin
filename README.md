<div align="center">

# 🌬️ BreezeAdmin

**轻量 · 高效 · 优雅** 的中后台管理系统解决方案

基于 Vue 3 + shadcn-vue + TypeScript 构建的高保真管理后台模板

[![Vue 3](https://img.shields.io/badge/Vue-3.4-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![shadcn-vue](https://img.shields.io/badge/shadcn--vue-latest-000000?logo=shadcnui&logoColor=white)](https://www.shadcn-vue.com/)
[![Pinia](https://img.shields.io/badge/Pinia-2.x-FFD859)](https://pinia.vuejs.org/)
[![License](https://img.shields.io/badge/License-Private-red)]()

[快速开始](#-快速开始) · [功能预览](#-功能特性) · [技术架构](#-技术栈) · [项目结构](#-项目结构)

</div>

---

## ✨ 功能特性

### 🎨 界面与交互

- 🌈 **主题系统** — 7 种预设主题色 + 自定义取色器，CSS 变量实时注入，版本化持久化存储
- 🌙 **暗色模式** — class 驱动的暗色/亮色无缝切换
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

- 🎭 **Mock 服务** — MSW 2 拦截全部 API，开发环境零依赖后端
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
├── vite.config.js           # Vite 构建配置
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
│              MSW (Mock Service)              │  Mock 层（仅开发环境）
└─────────────────────────────────────────────┘
```

> 详细的架构说明请参阅 [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 📜 许可证

本项目为私有项目，未经授权不得使用、复制或分发。

---

<div align="center">

**BreezeAdmin** © 2024 - Present

</div>
