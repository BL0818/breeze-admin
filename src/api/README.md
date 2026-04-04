# API 模块使用指南

## 目录结构

```
src/api/
├── index.ts              # 桶导出
└── modules/
    ├── auth.ts            # authApi:  login / getUserInfo / forgotPassword
    ├── dashboard.ts       # dashboardApi:  getMetrics / getSalesTrend / getRecentOrders
    ├── orders.ts          # ordersApi:  getOrders
    ├── users.ts           # usersApi:  getUsers
    └── query.ts           # queryApi:  getQueryRecords
```

## 导入规范

### API 调用 — 从 `@/api` 导入

```typescript
import { authApi, dashboardApi } from '@/api'
```

### 类型导入 — 从 `@/types/api-schema` 导入（红线）

```typescript
// ✅ 正确
import type { User, OrderDetail } from '@/types/api-schema'

// ❌ 簿止 — 禁止从 @/api/... 导入类型
import type { User } from '@/api/modules/auth'
```

## 基本用法

### 配合 `useRequest`（推荐）

拦截器已自动解包 `{ code, data, message }` 信封，`data.value` 直接是业务数据：

```typescript
import { useRequest } from 'alova'
import { dashboardApi } from '@/api'

// data.value 类型是 MetricsData，不再是 { code, data: MetricsData }
const metricsRequest = useRequest(dashboardApi.getMetrics, { immediate: false })

onMounted(() => {
  metricsRequest.send()
})
```

模板中直接访问：

```vue
<!-- ✅ 新写法：少一层 .data -->
<span>{{ metricsRequest.data.value.totalRevenue.value }}</span>

<!-- ❌ 旧写法：多一层 .data（已废弃） -->
<span>{{ metricsRequest.data.value.data.totalRevenue.value }}</span>
```

### 手动调用 `.send()`

```typescript
import { useRequest } from 'alova'
import { authApi } from '@/api'
import { BusinessError } from '@/utils/request'

const loginRequest = useRequest(
  (values: { username: string; password: string }) =>
    authApi.login(values.username, values.password),
  { immediate: false }
)

// 响应已解包，直接拿到 LoginData
try {
  const data = await loginRequest.send({ username: 'admin', password: 'admin123' })
  // data 类型是 { token: string; user: User }
  authStore.setAuth(data, true)
} catch (err) {
  if (err instanceof BusinessError) {
    // 业务码非 200，err.code + err.message 可用
    errorMessage.value = err.message
  } else {
    // HTTP 错误或网络错误
    errorMessage.value = '网络异常'
  }
}
```

## 响应拦截流程

```
HTTP 请求
  │
  ├─ HTTP 状态非 2xx ──→ throw Error
  │   ├─ 401 ──→ 自动 logout + 跳转 /login
  │
  └─ HTTP 2xx
      │
      ├─ json.code !== 200 ──→ throw BusinessError(code, message)
      │
      └─ json.code === 200 ──→ return json.data  ← 业务组件拿到这个
```

## 新增 API 端点

在 `src/api/modules/` 下新建文件，按以下模式：

```typescript
import { alovaInstance } from '@/utils/request'
import type { YourType } from '@/types/api-schema'

export const yourApi = {
  /** 接口描述 */
  getSomething: () => {
    return alovaInstance.Get<YourType>('/api/your-endpoint')
  },
}
```

然后在 `src/api/index.ts` 中追加导出：

```typescript
export { yourApi } from './modules/your'
```

同时在 `src/mocks/handlers.ts` 中添加对应 Mock handler（必须包含 `await delay()`）。

## 注意事项

- **禁止** 在 Vue 组件中直接使用 `alovaInstance`
- **禁止** 在组件中定义 `interface` 重复类型 — 统一从 `@/types/api-schema` 导入
- **禁止** 手动检查 `response.code === 200` — 拦截器已处理
- **禁止** 在 `@/api/modules/*.ts` 中导出类型 — 类型只从 `@/types/api-schema` 导出
