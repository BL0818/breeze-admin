import { alovaInstance } from '@/utils/request'
import type { MetricsData, SalesTrendItem, RecentOrder } from '@/types/api-schema'

export const dashboardApi = {
  /** 获取 KPI 指标卡片数据 */
  getMetrics: () => {
    return alovaInstance.Get<MetricsData>('/api/dashboard/metrics')
  },

  /** 获取销售趋势数据 */
  getSalesTrend: () => {
    return alovaInstance.Get<SalesTrendItem[]>('/api/dashboard/sales-trend')
  },

  /** 获取近期订单列表 */
  getRecentOrders: () => {
    return alovaInstance.Get<RecentOrder[]>('/api/dashboard/recent-orders')
  },
}
