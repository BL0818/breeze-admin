# MSW Mock 指南

本项目使用 [MSW (Mock Service Worker)](https://mswjs.io/) 在开发环境下拦截 API 请求，返回模拟数据，无需真实后端即可独立开发调试。

## 目录结构

```
src/mocks/
├── browser.ts      # MSW worker 实例（仅浏览器端）
├── handlers.ts     # 所有 mock 请求处理器
└── README.md       # 本文件

public/
└── mockServiceWorker.js   # MSW 自动生成的 Service Worker 文件
```

## 工作原理

1. `main.ts` 在 `import.meta.env.DEV` 条件下动态加载 MSW worker
2. Worker 启动后注册 Service Worker，拦截所有匹配的 fetch 请求
3. `handlers.ts` 中定义的 handler 会返回模拟数据
4. 页面从后台恢复时自动重新激活 worker（防止浏览器回收导致请求 404）

## 如何使用

### 新增一个 Mock 接口

在 `handlers.ts` 的 `handlers` 数组中添加新的 handler：

```typescript
import { http, HttpResponse, delay } from 'msw'

export const handlers = [
  // ... 已有的 handlers

  // GET 请求
  http.get('/api/your-endpoint', async () => {
    await delay(Math.random() * 500 + 300) // 模拟网络延迟
    return HttpResponse.json({
      code: 200,
      data: { /* 你的模拟数据 */ },
    })
  }),

  // POST 请求（带请求体校验）
  http.post('/api/your-endpoint', async ({ request }) => {
    await delay(Math.random() * 500 + 300)
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({
      code: 200,
      data: { id: Date.now(), ...body },
    })
  }),

  // 动态路由参数
  http.get('/api/items/:id', async ({ params }) => {
    await delay(Math.random() * 300 + 200)
    return HttpResponse.json({
      code: 200,
      data: { id: params.id, name: 'Example' },
    })
  }),

  // 错误响应
  http.get('/api/error-example', async () => {
    await delay(Math.random() * 300 + 200)
    return HttpResponse.json(
      { code: 500, message: 'Internal error', data: null },
      { status: 500 },
    )
  }),
]
```

### 数据 Schema 约定

- **所有 Zod Schema 统一在 `@/types/api-schema.ts` 定义**，handler 从该文件导入
- 禁止在 `handlers.ts` 中重新定义 `z.object`
- 每条 handler 必须调用 `delay()` 模拟真实网络延迟

### 确认 Mock 是否生效

打开浏览器 DevTools → Network 面板，被 MSW 拦截的请求会带有 `X-Mock-Request: true` 响应头。

## 如何从项目中移除 Mock

当后端 API 就绪，不再需要 mock 时，按以下步骤清理：

### 1. 移除启动代码

删除 `src/main.ts` 中 MSW 相关代码：

```diff
  async function bootstrap() {
    // ... pinia, app 初始化

-   // 仅在开发环境启动 MSW
-   if (import.meta.env.DEV) {
-     const { worker } = await import('./mocks/browser')
-     await worker.start({
-       onUnhandledRequest: 'bypass',
-       quiet: true,
-     })
-
-     document.addEventListener('visibilitychange', async () => {
-       if (!document.hidden) {
-         await worker.start()
-       }
-     })
-   }

    // ... 后续初始化
  }
```

### 2. 删除 Mock 文件

```bash
rm -rf src/mocks
rm public/mockServiceWorker.js
```

### 3. 卸载依赖

```bash
pnpm remove msw
```

### 4. 清理 Schema（可选）

如果 `src/types/api-schema.ts` 中的类型仅用于 mock，一并清理。若 API 层也在使用这些类型，保留即可。

---

> 参考：[MSW 官方文档](https://mswjs.io/docs/)
