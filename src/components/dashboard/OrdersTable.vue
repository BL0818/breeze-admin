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
import { Eye, Edit, MoreHorizontal } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

defineProps<{
  orders: {
    id: string
    customer: string
    email?: string
    amount: number
    status: string
    date: string
    items?: number
  }[]
  showDetails?: boolean
}>()

defineEmits<{
  view: [order: any]
  edit: [order: any]
}>()

const statusColors: Record<string, string> = {
  completed: 'bg-emerald-500',
  pending: 'bg-amber-500',
  processing: 'bg-indigo-500',
  cancelled: 'bg-red-500'
}

const statusTextColors: Record<string, string> = {
  completed: 'text-emerald-500',
  pending: 'text-amber-500',
  processing: 'text-indigo-500',
  cancelled: 'text-red-500'
}
</script>

<template>
  <div class="relative overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead v-if="showDetails">Email</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead v-if="showDetails">Items</TableHead>
          <TableHead>Date</TableHead>
          <TableHead class="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="order in orders" :key="order.id">
          <TableCell class="font-medium">{{ order.id }}</TableCell>
          <TableCell>{{ order.customer }}</TableCell>
          <TableCell v-if="showDetails">{{ order.email }}</TableCell>
          <TableCell>${{ order.amount.toLocaleString() }}</TableCell>
          <TableCell>
            <Badge :class="['text-white', statusColors[order.status]]">
              {{ order.status }}
            </Badge>
          </TableCell>
          <TableCell v-if="showDetails">{{ order.items }}</TableCell>
          <TableCell :class="statusTextColors[order.status]">{{ order.date }}</TableCell>
          <TableCell class="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" class="h-8 w-8 p-0">
                  <MoreHorizontal class="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="$emit('view', order)">
                  <Eye class="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem @click="$emit('edit', order)">
                  <Edit class="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
