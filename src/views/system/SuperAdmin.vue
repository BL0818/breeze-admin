<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRequest } from 'alova'
import { systemApi } from '@/api'
import type { SystemInfo } from '@/types/api-schema'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Server,
  Clock,
  Users,
  Activity,
  Database,
  Cpu,
  HardDrive,
  AlertTriangle,
  Trash2,
  RotateCcw,
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

const { t } = useI18n()

// 获取系统信息（拦截器已自动解包）
const infoRequest = useRequest(systemApi.getAdminInfo, { immediate: false })
// 获取管理员列表（拦截器已自动解包）
const adminsRequest = useRequest(systemApi.getAdminUsers, { immediate: false })

onMounted(() => {
  infoRequest.send()
  adminsRequest.send()
})

// 确认对话框状态
const confirmDialog = ref({
  open: false,
  title: '',
  description: '',
  action: '',
})

// 打开确认对话框
const openConfirm = (action: string) => {
  if (action === 'clearCache') {
    confirmDialog.value = {
      open: true,
      title: t('superAdmin.clearCache'),
      description: t('superAdmin.clearCacheDesc'),
      action,
    }
  } else if (action === 'resetConfig') {
    confirmDialog.value = {
      open: true,
      title: t('superAdmin.resetConfig'),
      description: t('superAdmin.resetConfigDesc'),
      action,
    }
  }
}

// 执行危险操作
const executeAction = () => {
  const action = confirmDialog.value.action
  confirmDialog.value.open = false

  if (action === 'clearCache') {
    toast.success(t('superAdmin.clearCache'), {
      description: t('superAdmin.clearCacheDesc'),
    })
  } else if (action === 'resetConfig') {
    toast.success(t('superAdmin.resetConfig'), {
      description: t('superAdmin.resetConfigDesc'),
    })
  }
}

// 状态颜色
const statusColor: Record<string, string> = {
  active: 'bg-emerald-500',
  inactive: 'bg-slate-400',
}

// 系统信息卡片配置
const infoCards = (info: SystemInfo) => [
  { key: 'version', icon: Server, label: t('superAdmin.version'), value: info.version },
  { key: 'uptime', icon: Clock, label: t('superAdmin.uptime'), value: info.uptime },
  { key: 'totalUsers', icon: Users, label: t('superAdmin.totalUsers'), value: String(info.totalUsers) },
  { key: 'totalRequests', icon: Activity, label: t('superAdmin.totalRequests'), value: info.totalRequests.toLocaleString() },
  { key: 'dbSize', icon: Database, label: t('superAdmin.dbSize'), value: info.dbSize },
  { key: 'memoryUsage', icon: HardDrive, label: t('superAdmin.memoryUsage'), value: info.memoryUsage },
  { key: 'cpuUsage', icon: Cpu, label: t('superAdmin.cpuUsage'), value: info.cpuUsage },
]
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">{{ t('superAdmin.title') }}</h2>
        <p class="text-muted-foreground">{{ t('superAdmin.description') }}</p>
      </div>
    </div>

    <!-- 系统信息卡片 -->
    <Card>
      <CardHeader>
        <CardTitle>{{ t('superAdmin.systemInfo') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <!-- 加载骨架屏 -->
        <div v-if="infoRequest.loading.value" class="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          <div v-for="i in 7" :key="i" class="space-y-2 rounded-lg border p-4">
            <Skeleton class="h-4 w-20" />
            <Skeleton class="h-6 w-16" />
          </div>
        </div>

        <!-- 系统信息数据 -->
        <div v-else-if="infoRequest.data.value" class="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          <div
            v-for="card in infoCards(infoRequest.data.value)"
            :key="card.key"
            class="flex items-center gap-3 rounded-lg border p-4"
          >
            <component :is="card.icon" class="h-5 w-5 text-muted-foreground" />
            <div>
              <p class="text-xs text-muted-foreground">{{ card.label }}</p>
              <p class="text-lg font-semibold">{{ card.value }}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 危险操作区域 -->
    <Card class="border-red-200 dark:border-red-900">
      <CardHeader>
        <CardTitle class="flex items-center gap-2 text-red-600">
          <AlertTriangle class="h-5 w-5" />
          {{ t('superAdmin.dangerZone') }}
        </CardTitle>
        <CardDescription>{{ t('superAdmin.dangerZoneDesc') }}</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- 清除缓存 -->
        <div class="flex items-center justify-between rounded-lg border border-red-200 dark:border-red-900 p-4">
          <div>
            <h4 class="font-medium">{{ t('superAdmin.clearCache') }}</h4>
            <p class="text-sm text-muted-foreground">{{ t('superAdmin.clearCacheDesc') }}</p>
          </div>
          <Button variant="destructive" class="ml-4" @click="openConfirm('clearCache')">
            <Trash2 class="mr-2 h-4 w-4" />
            {{ t('superAdmin.clearCache') }}
          </Button>
        </div>

        <!-- 重置配置 -->
        <div class="flex items-center justify-between rounded-lg border border-red-200 dark:border-red-900 p-4">
          <div>
            <h4 class="font-medium">{{ t('superAdmin.resetConfig') }}</h4>
            <p class="text-sm text-muted-foreground">{{ t('superAdmin.resetConfigDesc') }}</p>
          </div>
          <Button variant="destructive" class="ml-4" @click="openConfirm('resetConfig')">
            <RotateCcw class="mr-2 h-4 w-4" />
            {{ t('superAdmin.resetConfig') }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- 管理员列表 -->
    <Card>
      <CardHeader>
        <CardTitle>{{ t('superAdmin.adminList') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <!-- 加载骨架屏 -->
        <div v-if="adminsRequest.loading.value" class="space-y-3">
          <Skeleton v-for="i in 3" :key="i" class="h-12 w-full" />
        </div>

        <!-- 管理员表格 -->
        <div v-else-if="adminsRequest.data.value" class="relative overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{{ t('superAdmin.colName') }}</TableHead>
                <TableHead>{{ t('superAdmin.colEmail') }}</TableHead>
                <TableHead>{{ t('superAdmin.colRole') }}</TableHead>
                <TableHead>{{ t('superAdmin.colLastLogin') }}</TableHead>
                <TableHead>{{ t('superAdmin.colStatus') }}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="admin in adminsRequest.data.value"
                :key="admin.id"
              >
                <TableCell class="font-medium">{{ admin.name }}</TableCell>
                <TableCell>{{ admin.email }}</TableCell>
                <TableCell>
                  <Badge variant="outline">{{ admin.role }}</Badge>
                </TableCell>
                <TableCell class="text-xs">{{ admin.lastLoginAt }}</TableCell>
                <TableCell>
                  <Badge :class="['text-white', statusColor[admin.status]]">
                    {{ admin.status === 'active' ? t('superAdmin.active') : t('superAdmin.inactive') }}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- 空状态 -->
        <div v-else class="py-8 text-center text-muted-foreground">
          {{ t('common.noData') }}
        </div>
      </CardContent>
    </Card>

    <!-- 确认对话框（简易实现） -->
    <div
      v-if="confirmDialog.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="confirmDialog.open = false"
    >
      <Card class="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle class="text-red-600">{{ confirmDialog.title }}</CardTitle>
          <CardDescription>{{ confirmDialog.description }}</CardDescription>
        </CardHeader>
        <CardContent class="flex justify-end gap-2">
          <Button variant="outline" @click="confirmDialog.open = false">
            {{ t('superAdmin.cancel') }}
          </Button>
          <Button variant="destructive" @click="executeAction">
            {{ t('superAdmin.confirmAction') }}
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
