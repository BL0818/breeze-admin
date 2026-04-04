<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRequest } from 'alova'
import { queryApi } from '@/api'
import type { QueryRecord } from '@/types/api-schema'
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
import { Search, RotateCcw, ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import type { CalendarDate } from '@internationalized/date'

const { t, locale } = useI18n()

// Search conditions
const keyword = ref('')
const status = ref('all')
const priority = ref('all')
const department = ref('all')
const startDate = ref<CalendarDate | any>(undefined)
const endDate = ref<CalendarDate | any>(undefined)

// Date picker popover state
const startDateOpen = ref(false)
const endDateOpen = ref(false)

// Format DateValue to YYYY-MM-DD string for comparison
const formatDateValue = (date: any): string => {
  if (!date) return ''
  return date.toString()
}

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)

// 获取查询记录（拦截器已自动解包，data.value 直接是 QueryRecord[]）
const recordsRequest = useRequest(queryApi.getQueryRecords, { immediate: false })

onMounted(() => {
  recordsRequest.send()
})

// Reset form
const handleReset = () => {
  keyword.value = ''
  status.value = 'all'
  priority.value = 'all'
  department.value = 'all'
  startDate.value = undefined
  endDate.value = undefined
  currentPage.value = 1
}

// Filtered records
const filteredRecords = computed(() => {
  if (!recordsRequest.data.value) return []
  return recordsRequest.data.value.filter((item) => {
    const matchKeyword =
      !keyword.value ||
      item.title.toLowerCase().includes(keyword.value.toLowerCase()) ||
      item.applicant.toLowerCase().includes(keyword.value.toLowerCase())
    const matchStatus = status.value === 'all' || item.status === status.value
    const matchPriority = priority.value === 'all' || item.priority === priority.value
    const matchDept = department.value === 'all' || item.department === department.value
    const matchStart = !startDate.value || item.createDate >= formatDateValue(startDate.value)
    const matchEnd = !endDate.value || item.createDate <= formatDateValue(endDate.value)
    return matchKeyword && matchStatus && matchPriority && matchDept && matchStart && matchEnd
  })
})

// Pagination logic
const total = computed(() => filteredRecords.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

watch(totalPages, (val) => {
  if (currentPage.value > val) currentPage.value = val
})

watch([keyword, status, priority, department, startDate, endDate], () => {
  currentPage.value = 1
}, { deep: true })

watch(pageSize, () => {
  currentPage.value = 1
})

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRecords.value.slice(start, start + pageSize.value)
})

// Helpers
const statusColor: Record<string, string> = {
  pending: 'bg-amber-500',
  approved: 'bg-emerald-500',
  rejected: 'bg-red-500',
}

const priorityColor: Record<string, string> = {
  low: 'bg-slate-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  urgent: 'bg-rose-500',
}

const statusLabel: Record<string, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
}

const priorityLabel: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

const handleView = (record: QueryRecord) => {
  toast.info(`Viewing ${record.title}`, {
    description: `Applicant: ${record.applicant} | Amount: $${record.amount.toLocaleString()}`,
  })
}

// Pagination visible pages
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
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">{{ t('nav.queryTable') }}</h2>
        <p class="text-muted-foreground">{{ t('queryTable.description') }}</p>
      </div>
    </div>

    <!-- Query Form -->
    <Card>
      <CardContent class="pt-6">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <!-- Keyword -->
          <div class="space-y-2">
            <Label class="text-xs text-muted-foreground">{{ t('queryTable.keyword') }}</Label>
            <div class="relative">
              <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                v-model="keyword"
                :placeholder="t('queryTable.keywordPlaceholder')"
                class="pl-9"
              />
            </div>
          </div>

          <!-- Status -->
          <div class="space-y-2">
            <Label class="text-xs text-muted-foreground">{{ t('queryTable.status') }}</Label>
            <Select v-model="status">
              <SelectTrigger>
                <SelectValue :placeholder="t('queryTable.allStatuses')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{{ t('queryTable.allStatuses') }}</SelectItem>
                <SelectItem value="pending">{{ statusLabel.pending }}</SelectItem>
                <SelectItem value="approved">{{ statusLabel.approved }}</SelectItem>
                <SelectItem value="rejected">{{ statusLabel.rejected }}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Priority -->
          <div class="space-y-2">
            <Label class="text-xs text-muted-foreground">{{ t('queryTable.priority') }}</Label>
            <Select v-model="priority">
              <SelectTrigger>
                <SelectValue :placeholder="t('queryTable.allPriorities')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{{ t('queryTable.allPriorities') }}</SelectItem>
                <SelectItem value="low">{{ priorityLabel.low }}</SelectItem>
                <SelectItem value="medium">{{ priorityLabel.medium }}</SelectItem>
                <SelectItem value="high">{{ priorityLabel.high }}</SelectItem>
                <SelectItem value="urgent">{{ priorityLabel.urgent }}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Department -->
          <div class="space-y-2">
            <Label class="text-xs text-muted-foreground">{{ t('queryTable.department') }}</Label>
            <Select v-model="department">
              <SelectTrigger>
                <SelectValue :placeholder="t('queryTable.allDepartments')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{{ t('queryTable.allDepartments') }}</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Start Date -->
          <div class="space-y-2">
            <Label class="text-xs text-muted-foreground">{{ t('queryTable.startDate') }}</Label>
            <Popover v-model:open="startDateOpen">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  class="w-full justify-start text-left font-normal"
                  :class="!startDate && 'text-muted-foreground'"
                >
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  {{ startDate ? formatDateValue(startDate) : t('queryTable.selectDate') }}
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

          <!-- End Date -->
          <div class="space-y-2">
            <Label class="text-xs text-muted-foreground">{{ t('queryTable.endDate') }}</Label>
            <Popover v-model:open="endDateOpen">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  class="w-full justify-start text-left font-normal"
                  :class="!endDate && 'text-muted-foreground'"
                >
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  {{ endDate ? formatDateValue(endDate) : t('queryTable.selectDate') }}
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

          <!-- Actions -->
          <div class="flex items-end gap-2 md:col-span-2 lg:col-span-2">
            <Button variant="outline" class="gap-1" @click="handleReset">
              <RotateCcw class="h-4 w-4" />
              {{ t('queryTable.reset') }}
            </Button>
            <Button class="gap-1">
              <Search class="h-4 w-4" />
              {{ t('queryTable.search') }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Data Table -->
    <Card>
      <CardHeader>
        <CardTitle>{{ t('queryTable.resultList') }}</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Table -->
        <div class="relative overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-24">ID</TableHead>
                <TableHead>{{ t('queryTable.colTitle') }}</TableHead>
                <TableHead>{{ t('queryTable.colApplicant') }}</TableHead>
                <TableHead>{{ t('queryTable.colDepartment') }}</TableHead>
                <TableHead>{{ t('queryTable.colStatus') }}</TableHead>
                <TableHead>{{ t('queryTable.colPriority') }}</TableHead>
                <TableHead class="text-right">{{ t('queryTable.colAmount') }}</TableHead>
                <TableHead>{{ t('queryTable.colCreateDate') }}</TableHead>
                <TableHead class="text-right">{{ t('queryTable.colActions') }}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <!-- Loading -->
              <template v-if="recordsRequest.loading.value">
                <TableRow v-for="i in 5" :key="i">
                  <TableCell v-for="j in 9" :key="j">
                    <Skeleton class="h-4 w-full" />
                  </TableCell>
                </TableRow>
              </template>

              <!-- Data -->
              <TableRow
                v-for="record in paginatedRecords"
                v-else-if="paginatedRecords.length"
                :key="record.id"
              >
                <TableCell class="font-medium">{{ record.id }}</TableCell>
                <TableCell>{{ record.title }}</TableCell>
                <TableCell>{{ record.applicant }}</TableCell>
                <TableCell class="capitalize">{{ record.department }}</TableCell>
                <TableCell>
                  <Badge :class="['text-white', statusColor[record.status]]">
                    {{ statusLabel[record.status] }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge :class="['text-white', priorityColor[record.priority]]">
                    {{ priorityLabel[record.priority] }}
                  </Badge>
                </TableCell>
                <TableCell class="text-right">${{ record.amount.toLocaleString() }}</TableCell>
                <TableCell>{{ record.createDate }}</TableCell>
                <TableCell class="text-right">
                  <Button variant="ghost" size="sm" @click="handleView(record)">
                    {{ t('queryTable.view') }}
                  </Button>
                </TableCell>
              </TableRow>

              <!-- Empty -->
              <TableRow v-else>
                <TableCell colspan="9" class="h-24 text-center text-muted-foreground">
                  {{ t('common.noData') }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Pagination -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="text-sm text-muted-foreground">
            {{ t('queryTable.total') }} <span class="font-medium">{{ total }}</span>
            {{ t('queryTable.records') }}
            {{ t('queryTable.pageInfo', { current: currentPage, total: totalPages }) }}
          </div>

          <div class="flex items-center gap-3">
            <!-- Page size -->
            <div class="flex items-center gap-2">
              <span class="text-sm text-muted-foreground whitespace-nowrap">{{ t('queryTable.pageSize') }}</span>
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

            <!-- Page buttons -->
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
