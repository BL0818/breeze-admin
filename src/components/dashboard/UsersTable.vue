<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Eye, Edit, Trash2, MoreHorizontal } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

defineProps<{
  users: {
    id: string
    name: string
    email: string
    role: string
    status: string
    createdAt: string
  }[]
}>()

defineEmits<{
  view: [user: any]
  edit: [user: any]
  delete: [user: any]
}>()

const roleColors: Record<string, string> = {
  admin: 'bg-indigo-600',
  manager: 'bg-violet-500',
  user: 'bg-teal-500'
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500',
  inactive: 'bg-slate-500',
  pending: 'bg-amber-500'
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>

<template>
  <div class="relative overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead class="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="user in users" :key="user.id">
          <TableCell>
            <div class="flex items-center gap-3">
              <Avatar class="h-9 w-9">
                <AvatarFallback>{{ getInitials(user.name) }}</AvatarFallback>
              </Avatar>
              <span class="font-medium">{{ user.name }}</span>
            </div>
          </TableCell>
          <TableCell>{{ user.email }}</TableCell>
          <TableCell>
            <Badge :class="['text-white', roleColors[user.role]]">
              {{ user.role }}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge :class="['text-white', statusColors[user.status]]">
              {{ user.status }}
            </Badge>
          </TableCell>
          <TableCell>{{ user.createdAt }}</TableCell>
          <TableCell class="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" class="h-8 w-8 p-0">
                  <MoreHorizontal class="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="$emit('view', user)">
                  <Eye class="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem @click="$emit('edit', user)">
                  <Edit class="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem class="text-red-600" @click="$emit('delete', user)">
                  <Trash2 class="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
