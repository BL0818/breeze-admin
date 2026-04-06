# BreezeAdmin - Claude Code 编码指令

> 详细架构文档参考 [ARCHITECTURE.md](./ARCHITECTURE.md)

## 技术栈

Vue 3 + TypeScript (strict) + Vite + shadcn-vue + alova + pinia + MSW

## 编码红线（强制）

### 类型系统
- 类型**只从** `@/types/api-schema` 导入：`import type { Xxx } from '@/types/api-schema'`
- **禁止**从 `@/api/...` 导入类型
- **禁止**在 `api-schema.ts` 以外的文件定义 `z.object`

### HTTP 请求
- views 中**禁止**直接使用 `alovaInstance`，必须通过 `@/api` 模块调用
- 错误处理使用 `BusinessError`（从 `@/utils/request` 导入）
- 拦截器已自动解包 `json.data`，组件直接拿到 data

### Mock 服务
- MSW handlers 的 Schema 从 `@/types/api-schema` 统一导入，**禁止重复定义**
- 每个 handler 返回前**必须**调用 `await delay(Math.random() * 500 + 300)`
- Mock 启用时 `baseURL` 自动置空（已在 `request.ts` 中处理）

### 状态管理
- Auth store **禁止**手动 `localStorage` 调用，由 `pinia-plugin-persistedstate` 统一管理
- 主题持久化使用版本化控制（`THEME_STORE_VERSION`）

### 路由与 i18n
- 路由 `meta.title` **必须**使用 i18n key（`'nav.xxx'`），**严禁**硬编码中英文字符串
- 路由配置集中在 `src/router/routes-config.ts`

## 项目结构速查

```
src/types/api-schema.ts    → Zod Schema 唯一数据源（所有类型的唯一来源）
src/utils/request.ts       → Alova 实例（拦截器 + BusinessError + 自动解包）
src/api/modules/*.ts       → 模块化 API 定义
src/api/index.ts           → 桶导出（组件统一 `import { xxxApi } from '@/api'`）
src/stores/                → auth / app / theme / tabs
src/router/routes-config.ts → 集中式路由配置
src/mocks/handlers.ts      → MSW handlers
src/locales/               → i18n（en.ts / zh.ts）
src/components/ui/         → shadcn-vue 组件（禁止手动修改，用 `npx shadcn-vue` 管理）
src/components/layout/     → 布局组件（AppLayout / Sidebar / Header / TabsBar / Footer / ThemeSettings）
```

## 响应拦截流程

```
HTTP response
  ├─ !ok → 401? → 动态 import auth store → logout → /login
  │        其他 → throw Error
  └─ ok → json()
           ├─ json.code !== 200 → throw BusinessError(code, message)
           └─ return json.data ← 自动解包
```

## 页面组件标准模式

```typescript
// ✅ 正确
import { xxxApi } from '@/api'
import { BusinessError } from '@/utils/request'
import type { XxxData } from '@/types/api-schema'

const request = useRequest((params) => xxxApi.getList(params), { immediate: false })
try {
  const data = await request.send(params)
} catch (err) {
  if (err instanceof BusinessError) { /* 业务错误 */ }
}
```

## 代码注释语言

与现有代码库保持一致：使用英文注释。
