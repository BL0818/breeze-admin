<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRequest } from 'alova'
import { usersApi } from '@/api'
import type { UserListItem } from '@/types/api-schema'
import UsersTable from '@/components/dashboard/UsersTable.vue'
import UsersTableSkeleton from '@/components/dashboard/UsersTableSkeleton.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, UserPlus, Download, Loader2 } from 'lucide-vue-next'
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
const roleFilter = ref('all')
const statusFilter = ref('all')

// 获取用户列表（拦截器已自动解包，data.value 直接是 UserListItem[]）
const usersRequest = useRequest(usersApi.getUsers, { immediate: false })

onMounted(() => {
  usersRequest.send()
})

const filteredUsers = computed(() => {
  if (!usersRequest.data.value) return []

  return usersRequest.data.value.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesRole = roleFilter.value === 'all' || user.role === roleFilter.value
    const matchesStatus = statusFilter.value === 'all' || user.status === statusFilter.value

    return matchesSearch && matchesRole && matchesStatus
  })
})

const handleViewUser = (user: UserListItem) => {
  toast.success(`Viewing user ${user.name}`, {
    description: `${user.email} - ${user.role}`
  })
}

const handleEditUser = (user: UserListItem) => {
  toast.info(`Editing user ${user.name}`, {
    description: `${user.email}`
  })
}

const handleDeleteUser = (user: UserListItem) => {
  toast.error(`Deleting user ${user.name}`, {
    description: `${user.email} will be permanently deleted`
  })
}

const roleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'user', label: 'User' }
]

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' }
]

// 导出 Excel
const { isExporting, exportToExcel } = useExportExcel()

const handleExport = async () => {
  const data = filteredUsers.value
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status' },
    { key: 'createdAt', header: 'Created At' }
  ]
  await exportToExcel(data, columns, 'users', {
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
        <h2 class="text-3xl font-bold tracking-tight">{{ t('nav.userManagement') }}</h2>
        <p class="text-muted-foreground">{{ t('users.description') }}</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" :disabled="isExporting" @click="handleExport">
          <Loader2 v-if="isExporting" class="mr-2 h-4 w-4 animate-spin" />
          <Download v-else class="mr-2 h-4 w-4" />
          {{ t('common.export') }}
        </Button>
        <Button>
          <UserPlus class="mr-2 h-4 w-4" />
          {{ t('users.addUser') }}
        </Button>
      </div>
    </div>

    <!-- Filters -->
    <Card>
      <CardContent class="pt-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-center">
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              v-model="searchQuery"
              :placeholder="t('users.searchPlaceholder')"
              class="pl-9"
            />
          </div>
          <div class="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="outline">
                  <Filter class="mr-2 h-4 w-4" />
                  {{ roleFilter === 'all' ? 'All Roles' : roleFilter }}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-40">
                <DropdownMenuCheckboxItem
                  v-for="option in roleOptions"
                  :key="option.value"
                  v-model:checked="roleFilter"
                  :value="option.value"
                >
                  {{ option.label }}
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

    <!-- Users Table -->
    <Card>
      <CardHeader>
        <CardTitle>{{ t('users.userList') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <UsersTableSkeleton v-if="usersRequest.loading.value" />
        <UsersTable
          v-else-if="usersRequest.data.value"
          :users="filteredUsers"
          @view="handleViewUser"
          @edit="handleEditUser"
          @delete="handleDeleteUser"
        />
        <div v-else class="py-8 text-center text-muted-foreground">
          {{ t('common.noData') }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>
