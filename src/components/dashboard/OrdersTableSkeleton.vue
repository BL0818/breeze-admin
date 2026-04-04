<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
</script>

<template>
  <div class="relative overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="i in 5" :key="i">
          <TableCell class="font-medium">
            <Skeleton class="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton class="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton class="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton class="h-5 w-20 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton class="h-4 w-24" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
