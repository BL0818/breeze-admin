<script setup lang="ts">
import { onMounted } from 'vue'
import { useRequest } from 'alova'
import { systemApi } from '@/api'
import type { RolePermission, PermissionItem } from '@/types/api-schema'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Shield, Users, ToggleLeft } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

const { t } = useI18n()

// 获取角色权限列表（拦截器已自动解包，data.value 直接是 RolePermission[]）
const permissionsRequest = useRequest(systemApi.getPermissions, { immediate: false })

onMounted(() => {
  permissionsRequest.send()
})

// 权限开关切换
const handleToggle = (permission: PermissionItem, role: RolePermission) => {
  permission.enabled = !permission.enabled
  const status = permission.enabled ? t('switchPermissions.enabled') : t('switchPermissions.disabled')
  toast.success(`${t(`switchPermissions.permNames.${permission.name}`)} - ${status}`, {
    description: `${t('switchPermissions.roleList')}: ${t(`switchPermissions.roleNames.${role.roleName}`)}`,
  })
}

// 分类颜色映射
const categoryColor: Record<string, string> = {
  user: 'bg-blue-100 text-blue-800',
  permission: 'bg-purple-100 text-purple-800',
  system: 'bg-slate-100 text-slate-800',
  data: 'bg-emerald-100 text-emerald-800',
  security: 'bg-red-100 text-red-800',
  order: 'bg-amber-100 text-amber-800',
  report: 'bg-cyan-100 text-cyan-800',
  overview: 'bg-indigo-100 text-indigo-800',
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">{{ t('switchPermissions.title') }}</h2>
        <p class="text-muted-foreground">{{ t('switchPermissions.description') }}</p>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="permissionsRequest.loading.value" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="i in 3" :key="i">
        <CardHeader>
          <Skeleton class="h-6 w-32" />
          <Skeleton class="h-4 w-24" />
        </CardHeader>
        <CardContent class="space-y-4">
          <Skeleton v-for="j in 4" :key="j" class="h-12 w-full" />
        </CardContent>
      </Card>
    </div>

    <!-- 权限卡片列表 -->
    <div v-else-if="permissionsRequest.data.value" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="role in permissionsRequest.data.value" :key="role.id">
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle class="flex items-center gap-2">
              <Shield class="h-5 w-5" />
              {{ t(`switchPermissions.roleNames.${role.roleName}`) }}
            </CardTitle>
            <Badge variant="outline" class="text-xs">
              <Users class="mr-1 h-3 w-3" />
              {{ t('switchPermissions.userCount', { count: role.userCount }) }}
            </Badge>
          </div>
          <CardDescription class="font-mono text-xs">{{ role.roleCode }}</CardDescription>
        </CardHeader>
        <CardContent class="space-y-3">
          <div
            v-for="permission in role.permissions"
            :key="permission.id"
            class="flex items-center justify-between gap-2 rounded-lg border p-3"
          >
            <div class="min-w-0 flex-1 space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-sm font-medium">{{ t(`switchPermissions.permNames.${permission.name}`) }}</span>
                <Badge :class="['text-xs', categoryColor[permission.category] || 'bg-gray-100 text-gray-800']">
                  {{ t(`switchPermissions.categories.${permission.category}`) }}
                </Badge>
              </div>
              <p class="truncate text-xs text-muted-foreground">{{ t(`switchPermissions.permDescs.${permission.description}`) }}</p>
              <p class="truncate font-mono text-xs text-muted-foreground">{{ permission.code }}</p>
            </div>
            <div class="flex shrink-0 items-center gap-2">
              <Label :for="`switch-${permission.id}`" class="whitespace-nowrap text-xs text-muted-foreground">
                {{ permission.enabled ? t('switchPermissions.enabled') : t('switchPermissions.disabled') }}
              </Label>
              <Switch
                :id="`switch-${permission.id}`"
                :checked="permission.enabled"
                @update:checked="handleToggle(permission, role)"
              />
            </div>
          </div>

          <!-- 无权限提示 -->
          <div
            v-if="!role.permissions.length"
            class="flex items-center justify-center py-6 text-sm text-muted-foreground"
          >
            <ToggleLeft class="mr-2 h-4 w-4" />
            {{ t('switchPermissions.noPermissions') }}
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 空状态 -->
    <div v-else class="py-12 text-center text-muted-foreground">
      {{ t('common.noData') }}
    </div>
  </div>
</template>
