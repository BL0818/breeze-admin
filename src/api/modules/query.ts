import { alovaInstance } from '@/utils/request'
import type { QueryRecord } from '@/types/api-schema'

export const queryApi = {
  /** 获取查询记录列表 */
  getQueryRecords: () => {
    return alovaInstance.Get<QueryRecord[]>('/api/query-records')
  },
}
