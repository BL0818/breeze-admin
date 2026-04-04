import { alovaInstance } from '@/utils/request'
import type { OrderDetail } from '@/types/api-schema'

export const ordersApi = {
  /** 获取订单列表 */
  getOrders: () => {
    return alovaInstance.Get<OrderDetail[]>('/api/orders')
  },
}
