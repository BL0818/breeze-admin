import { alovaInstance } from '@/utils/request'
import type { ExampleItem } from '@/types/api-schema'

export const exampleApi = {
  /** GET 示例：获取列表 */
  getList: () => {
    return alovaInstance.Get<ExampleItem[]>('/api/examples/list')
  },

  /** POST 示例：创建资源 */
  createItem: (name: string, email: string) => {
    return alovaInstance.Post<ExampleItem>('/api/examples/create', { name, email })
  },

  /** PUT 示例：更新资源 */
  updateItem: (id: string, name: string, age: number) => {
    return alovaInstance.Put<ExampleItem>(`/api/examples/update/${id}`, { name, age })
  },

  /** DELETE 示例：删除资源 */
  deleteItem: (id: string) => {
    return alovaInstance.Delete<{ success: boolean }>(`/api/examples/delete/${id}`)
  },

  /** 并发请求 A：用户统计 */
  getConcurrentA: () => {
    return alovaInstance.Get<{ totalUsers: number; activeUsers: number }>('/api/examples/concurrent-a')
  },

  /** 并发请求 B：订单统计 */
  getConcurrentB: () => {
    return alovaInstance.Get<{ totalOrders: number; revenue: number }>('/api/examples/concurrent-b')
  },

  /** 并发请求 C：系统状态 */
  getConcurrentC: () => {
    return alovaInstance.Get<{ cpu: string; memory: string }>('/api/examples/concurrent-c')
  },

  /** 错误处理：404 */
  getError404: () => {
    return alovaInstance.Get<never>('/api/examples/error/404')
  },

  /** 错误处理：500 */
  getError500: () => {
    return alovaInstance.Get<never>('/api/examples/error/500')
  },

  /** 错误处理：业务异常 */
  getErrorBusiness: () => {
    return alovaInstance.Get<never>('/api/examples/error/business')
  },
}
