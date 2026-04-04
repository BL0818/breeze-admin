<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRequest } from 'alova'
import { systemApi } from '@/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import type { CalendarDate } from '@internationalized/date'

const { t, locale } = useI18n()

// 搜索条件
const keyword = ref('')
const methodFilter = ref('all')
const statusFilter = ref('all')
const codeFilter = ref('all')
const startDate = ref<CalendarDate | any>(undefined)
const endDate = ref<CalendarDate | any>(undefined)

// 日期选择器弹出状态
const startDateOpen = ref(false)
const endDateOpen = ref(false)

// 格式化日期为 YYYY-MM-DD 字符串
const formatDateValue = (date: any): string => {
  if (!date) return ''
  return date.toString()
}

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 获取请求日志（拦截器已自动解包，data.value 直接是 RequestLog[]）
const logsRequest = useRequest(systemApi.getRequestLogs, { immediate: false })

onMounted(() => {
  logsRequest.send()
})

// 过滤后的记录
const filteredRecords = computed(() => {
  if (!logsRequest.data.value) return []
  return logsRequest.data.value.filter((item) => {
    const matchKeyword =
      !keyword.value ||
      item.path.toLowerCase().includes(keyword.value.toLowerCase()) ||
      item.ip.toLowerCase().includes(keyword.value.toLowerCase()) ||
      item.userAgent.toLowerCase().includes(keyword.value.toLowerCase())
    const matchMethod = methodFilter.value === 'all' || item.method === methodFilter.value
    const matchStatus = statusFilter.value === 'all' || item.status === statusFilter.value
    const matchCode = codeFilter.value === 'all' || String(item.statusCode) === codeFilter.value
    const matchStart = !startDate.value || item.timestamp >= formatDateValue(startDate.value)
    const matchEnd = !endDate.value || item.timestamp <= formatDateValue(endDate.value)
    return matchKeyword && matchMethod && matchStatus && matchCode && matchStart && matchEnd
  })
})

// 分页逻辑
const total = computed(() => filteredRecords.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

watch(totalPages, (val) => {
  if (currentPage.value > val) currentPage.value = val
})

watch([keyword, methodFilter, statusFilter, codeFilter, startDate, endDate], () => {
  currentPage.value = 1
}, { deep: true })

watch(pageSize, () => {
  currentPage.value = 1
})

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRecords.value.slice(start, start + pageSize.value)
})

// 辅助函数
const methodColor: Record<string, string> = {
  GET: 'bg-blue-500',
  POST: 'bg-emerald-500',
  PUT: 'bg-amber-500',
  DELETE: 'bg-red-500',
  PATCH: 'bg-purple-500',
}

const statusColor: Record<string, string> = {
  success: 'bg-emerald-500',
  failed: 'bg-red-500',
  timeout: 'bg-amber-500',
}

const codeColor = (code: number): string => {
  if (code >= 200 && code < 300) return 'bg-emerald-100 text-emerald-800'
  if (code >= 400 && code < 500) return 'bg-amber-100 text-amber-800'
  if (code >= 500) return 'bg-red-100 text-red-800'
  return ''
}

// 分页可见页码
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const maxVisible = 5
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  } else {
    let start = Math.max(1, currentPage.value - 2)
    let end = Math.min(totalPages.value, start + maxVisible - 1)
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }
    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < totalPages.value) {
      if (end < totalPages.value - 1) pages.push('...')
      pages.push(totalPages.value)
    }
  }
  return pages
})

// 状态码选项
const codeOptions = ['200', '201', '204', '400', '401', '403', '404', '500']
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">{{ t('requestManagement.title') }}</h2>
        <p class="text-muted-foreground">{{ t('requestManagement.description') }}</p>
      </div>
    </div>

    <!-- 搜索筛选 -->
    <Card>
      <CardContent class="pt-6">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <!-- 关键词 -->
          <div class="space-y-2">
            <Label class="text-xs text-muted-foreground">{{ t('requestManagement.colPath') }}</Label>
            <div class="relative">
              <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                v-model="keyword"
                :placeholder="t('requestManagement.searchPlaceholder')"
                class="pl-9"
              />
            </div>
          </div>

          <!-- 方法筛选 -->
          <div class="space-y-2">
            <Label class="text-xs text-muted-foreground">{{ t('requestManagement.colMethod') }}</Label>
            <Select v-model="methodFilter">
              <SelectTrigger>
                <SelectValue :placeholder="t('requestManagement.allMethods')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{{ t('requestManagement.allMethods') }}</SelectItem>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- 状态筛选 -->
          <div class="space-y-2">
            <Label class="text-xs text-muted-foreground">{{ t('requestManagement.colStatus') }}</Label>
            <Select v-model="statusFilter">
              <SelectTrigger>
                <SelectValue :placeholder="t('requestManagement.allStatuses')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{{ t('requestManagement.allStatuses') }}</SelectItem>
                <SelectItem value="success">{{ t('requestManagement.success') }}</SelectItem>
                <SelectItem value="failed">{{ t('requestManagement.failed') }}</SelectItem>
                <SelectItem value="timeout">{{ t('requestManagement.timeout') }}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- 状态码筛选 -->
          <div class="space-y-2">
            <Label class="text-xs text-muted-foreground">{{ t('requestManagement.colStatusCode') }}</Label>
            <Select v-model="codeFilter">
              <SelectTrigger>
                <SelectValue :placeholder="t('requestManagement.allCodes')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{{ t('requestManagement.allCodes') }}</SelectItem>
                <SelectItem v-for="code in codeOptions" :key="code" :value="code">{{ code }}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- 开始日期 -->
          <div class="space-y-2">
            <Label class="text-xs text-muted-foreground">{{ t('requestManagement.startDate') }}</Label>
            <Popover v-model:open="startDateOpen">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  class="w-full justify-start text-left font-normal"
                  :class="!startDate && 'text-muted-foreground'"
                >
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  {{ startDate ? formatDateValue(startDate) : t('requestManagement.colTimestamp') }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0" align="start">
                <Calendar
                  v-model="startDate"
                  :locale="locale"
                  @update:model-value="startDateOpen = false"
                />
              </PopoverContent>
            </Popover>
          </div>

          <!-- 结束日期 -->
          <div class="space-y-2">
            <Label class="text-xs text-muted-foreground">{{ t('requestManagement.endDate') }}</Label>
            <Popover v-model:open="endDateOpen">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  class="w-full justify-start text-left font-normal"
                  :class="!endDate && 'text-muted-foreground'"
                >
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  {{ endDate ? formatDateValue(endDate) : t('requestManagement.colTimestamp') }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0" align="start">
                <Calendar
                  v-model="endDate"
                  :locale="locale"
                  @update:model-value="endDateOpen = false"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 数据表格 -->
    <Card>
      <CardHeader>
        <CardTitle>{{ t('requestManagement.title') }}</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- 表格 -->
        <div class="relative overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-28">{{ t('requestManagement.colId') }}</TableHead>
                <TableHead>{{ t('requestManagement.colPath') }}</TableHead>
                <TableHead class="w-24">{{ t('requestManagement.colMethod') }}</TableHead>
                <TableHead class="w-24">{{ t('requestManagement.colStatusCode') }}</TableHead>
                <TableHead class="w-28 text-right">{{ t('requestManagement.colDuration') }}</TableHead>
                <TableHead class="w-32">{{ t('requestManagement.colIp') }}</TableHead>
                <TableHead class="w-28">{{ t('requestManagement.colStatus') }}</TableHead>
                <TableHead class="w-44">{{ t('requestManagement.colTimestamp') }}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <!-- 加载骨架屏 -->
              <template v-if="logsRequest.loading.value">
                <TableRow v-for="i in 5" :key="i">
                  <TableCell v-for="j in 8" :key="j">
                    <Skeleton class="h-4 w-full" />
                  </TableCell>
                </TableRow>
              </template>

              <!-- 数据 -->
              <TableRow
                v-for="record in paginatedRecords"
                v-else-if="paginatedRecords.length"
                :key="record.id"
              >
                <TableCell class="font-medium">{{ record.id }}</TableCell>
                <TableCell class="font-mono text-xs">{{ record.path }}</TableCell>
                <TableCell>
                  <Badge :class="['text-white text-xs', methodColor[record.method]]">
                    {{ record.method }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span :class="['text-xs font-medium px-2 py-0.5 rounded', codeColor(record.statusCode)]">
                    {{ record.statusCode }}
                  </span>
                </TableCell>
                <TableCell class="text-right">{{ record.duration }}</TableCell>
                <TableCell class="font-mono text-xs">{{ record.ip }}</TableCell>
                <TableCell>
                  <Badge :class="['text-white text-xs', statusColor[record.status]]">
                    {{ record.status === 'success' ? t('requestManagement.success') : record.status === 'failed' ? t('requestManagement.failed') : t('requestManagement.timeout') }}
                  </Badge>
                </TableCell>
                <TableCell class="text-xs">{{ record.timestamp }}</TableCell>
              </TableRow>

              <!-- 空状态 -->
              <TableRow v-else>
                <TableCell colspan="8" class="h-24 text-center text-muted-foreground">
                  {{ t('common.noData') }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- 分页 -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="text-sm text-muted-foreground">
            {{ t('requestManagement.total') }} <span class="font-medium">{{ total }}</span>
            {{ t('requestManagement.records') }}
            {{ t('requestManagement.pageInfo', { current: currentPage, total: totalPages }) }}
          </div>

          <div class="flex items-center gap-3">
            <!-- 每页条数 -->
            <div class="flex items-center gap-2">
              <span class="text-sm text-muted-foreground whitespace-nowrap">{{ t('requestManagement.pageSize') }}</span>
              <Select v-model="pageSize">
                <SelectTrigger class="h-8 w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem :value="10">10</SelectItem>
                  <SelectItem :value="20">20</SelectItem>
                  <SelectItem :value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- 页码按钮 -->
            <div class="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                class="h-8 w-8"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                <ChevronLeft class="h-4 w-4" />
              </Button>

              <Button
                v-for="page in visiblePages"
                :key="page"
                variant="outline"
                size="sm"
                class="h-8 min-w-8 px-2"
                :class="{ 'bg-primary text-primary-foreground hover:bg-primary/90': page === currentPage }"
                :disabled="page === '...'"
                @click="typeof page === 'number' && (currentPage = page)"
              >
                {{ page }}
              </Button>

              <Button
                variant="outline"
                size="icon"
                class="h-8 w-8"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                <ChevronRight class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
