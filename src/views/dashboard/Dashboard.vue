<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRequest } from 'alova'
import { dashboardApi } from '@/api'
import MetricCard from '@/components/dashboard/MetricCard.vue'
import MetricCardSkeleton from '@/components/dashboard/MetricCardSkeleton.vue'
import SalesChart from '@/components/dashboard/SalesChart.vue'
import OrdersTable from '@/components/dashboard/OrdersTable.vue'
import OrdersTableSkeleton from '@/components/dashboard/OrdersTableSkeleton.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useTimeoutFn } from '@vueuse/core'

const { t } = useI18n()

// Skeleton 防抖控制
const showMetricSkeletons = ref(false)
const showOrdersSkeleton = ref(false)
const showChartSkeleton = ref(false)

const { start: startMetricTimer, stop: stopMetricTimer } = useTimeoutFn(() => {
  showMetricSkeletons.value = true
}, 300)

const { start: startOrdersTimer, stop: stopOrdersTimer } = useTimeoutFn(() => {
  showOrdersSkeleton.value = true
}, 300)

const { start: startChartTimer, stop: stopChartTimer } = useTimeoutFn(() => {
  showChartSkeleton.value = true
}, 300)

// Get metrics data（拦截器已自动解包，data.value 直接是 MetricsData）
const metricsRequest = useRequest(dashboardApi.getMetrics, { immediate: false })

// Get sales trend（data.value 直接是 SalesTrendItem[]）
const salesTrendRequest = useRequest(dashboardApi.getSalesTrend, { immediate: false })

// Get recent orders（data.value 直接是 RecentOrder[]）
const ordersRequest = useRequest(dashboardApi.getRecentOrders, { immediate: false })

onMounted(async () => {
  // Start timers immediately when requests begin
  startMetricTimer()
  startOrdersTimer()
  startChartTimer()

  await Promise.all([
    metricsRequest.send(),
    salesTrendRequest.send(),
    ordersRequest.send()
  ])

  // Stop all timers after data loads
  stopMetricTimer()
  stopOrdersTimer()
  stopChartTimer()
  showMetricSkeletons.value = false
  showOrdersSkeleton.value = false
  showChartSkeleton.value = false
})
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h2 class="text-3xl font-bold tracking-tight">{{ t('dashboard.title') }}</h2>
      <p class="text-muted-foreground">{{ t('common.overviewOfBusiness') }}</p>
    </div>

    <!-- Metrics Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <template v-if="showMetricSkeletons">
        <MetricCardSkeleton v-for="i in 4" :key="i" />
      </template>
      <template v-else-if="metricsRequest.data.value">
        <MetricCard
          :title="t('dashboard.totalRevenue')"
          :value="metricsRequest.data.value.totalRevenue.value"
          :change="metricsRequest.data.value.totalRevenue.change"
          :icon="DollarSign"
        />
        <MetricCard
          :title="t('dashboard.subscriptions')"
          :value="metricsRequest.data.value.subscriptions.value"
          :change="metricsRequest.data.value.subscriptions.change"
          :icon="Users"
        />
        <MetricCard
          :title="t('dashboard.activeUsers')"
          :value="metricsRequest.data.value.activeUsers.value"
          :change="metricsRequest.data.value.activeUsers.change"
          :icon="ShoppingCart"
        />
        <MetricCard
          :title="t('dashboard.sales')"
          :value="metricsRequest.data.value.sales.value"
          :change="metricsRequest.data.value.sales.change"
          :icon="TrendingUp"
        />
      </template>
    </div>

    <!-- Charts and Tables -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <!-- Sales Chart -->
      <Card class="col-span-4">
        <CardHeader>
          <CardTitle>{{ t('dashboard.salesTrend') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart
            v-if="salesTrendRequest.data.value"
            :data="salesTrendRequest.data.value"
          />
          <div v-else-if="showChartSkeleton" class="h-[300px] flex items-center justify-center">
            <span class="text-muted-foreground">{{ t('common.loadingChart') }}</span>
          </div>
          <div v-else class="h-[300px] flex items-center justify-center">
            <span class="text-muted-foreground">{{ t('common.noData') }}</span>
          </div>
        </CardContent>
      </Card>

      <!-- Recent Orders -->
      <Card class="col-span-3">
        <CardHeader>
          <CardTitle>{{ t('dashboard.recentOrders') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersTableSkeleton v-if="showOrdersSkeleton" />
          <OrdersTable
            v-else-if="ordersRequest.data.value"
            :orders="ordersRequest.data.value"
          />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
