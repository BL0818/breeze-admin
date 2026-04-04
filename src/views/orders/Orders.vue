<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRequest } from 'alova'
import { ordersApi } from '@/api'
import type { OrderDetail } from '@/types/api-schema'
import OrdersTable from '@/components/dashboard/OrdersTable.vue'
import OrdersTableSkeleton from '@/components/dashboard/OrdersTableSkeleton.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, Download, Loader2 } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { toast } from 'vue-sonner'
import { useExportExcel } from '@/hooks/useExportExcel'

const { t } = useI18n()

const searchQuery = ref('')
const statusFilter = ref('all')

// 获取订单列表（拦截器已自动解包，data.value 直接是 OrderDetail[]）
const ordersRequest = useRequest(ordersApi.getOrders, { immediate: false })

onMounted(() => {
  ordersRequest.send()
})

const filteredOrders = computed(() => {
  if (!ordersRequest.data.value) return []

  return ordersRequest.data.value.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus = statusFilter.value === 'all' || order.status === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

const handleViewOrder = (order: OrderDetail) => {
  toast.success(`Viewing order ${order.id}`, {
    description: `Customer: ${order.customer} - $${order.amount.toLocaleString()}`
  })
}

const handleEditOrder = (order: OrderDetail) => {
  toast.info(`Editing order ${order.id}`, {
    description: `Customer: ${order.customer}`
  })
}

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'cancelled', label: 'Cancelled' }
]

// 导出 Excel
const { isExporting, exportToExcel } = useExportExcel()

const handleExport = async () => {
  const data = filteredOrders.value
  const columns = [
    { key: 'id', header: 'Order ID' },
    { key: 'customer', header: 'Customer' },
    { key: 'email', header: 'Email' },
    { key: 'amount', header: 'Amount' },
    { key: 'status', header: 'Status' },
    { key: 'date', header: 'Date' },
    { key: 'items', header: 'Items' }
  ]
  await exportToExcel(data, columns, 'orders', {
    exportSuccessText: t('common.exportSuccess'),
    exportFailedText: t('common.exportFailed')
  })
}
</script>

<template>
  <div class="space-y-6 relative">
    <!-- Export Loading Overlay -->
    <div
      v-if="isExporting"
      class="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <div class="flex flex-col items-center gap-3">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
        <p class="text-sm text-muted-foreground">{{ t('common.exporting') || '导出中...' }}</p>
      </div>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">{{ t('nav.orders') }}</h2>
        <p class="text-muted-foreground">{{ t('orders.description') }}</p>
      </div>
      <Button variant="outline" :disabled="isExporting" @click="handleExport">
        <Loader2 v-if="isExporting" class="mr-2 h-4 w-4 animate-spin" />
        <Download v-else class="mr-2 h-4 w-4" />
        {{ t('common.export') }}
      </Button>
    </div>

    <!-- Filters -->
    <Card>
      <CardContent class="pt-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-center">
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              v-model="searchQuery"
              :placeholder="t('orders.searchPlaceholder')"
              class="pl-9"
            />
          </div>
          <div class="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="outline">
                  <Filter class="mr-2 h-4 w-4" />
                  {{ statusFilter === 'all' ? 'All Statuses' : statusFilter }}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-40">
                <DropdownMenuCheckboxItem
                  v-for="option in statusOptions"
                  :key="option.value"
                  v-model:checked="statusFilter"
                  :value="option.value"
                >
                  {{ option.label }}
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Orders Table -->
    <Card>
      <CardHeader>
        <CardTitle>{{ t('orders.orderList') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <OrdersTableSkeleton v-if="ordersRequest.loading.value" />
        <OrdersTable
          v-else-if="ordersRequest.data.value"
          :orders="filteredOrders"
          :show-details="true"
          @view="handleViewOrder"
          @edit="handleEditOrder"
        />
        <div v-else class="py-8 text-center text-muted-foreground">
          {{ t('common.noData') }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>
