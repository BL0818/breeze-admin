<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const skeletonRows = Array.from({ length: 5 })
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-3">
      <Skeleton class="h-9 w-9 rounded-full" />
      <div class="space-y-2">
        <Skeleton class="h-4 w-[150px]" />
        <Skeleton class="h-4 w-[100px]" />
      </div>
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[200px]">User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead class="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(_, index) in skeletonRows" :key="index">
          <TableCell>
            <div class="flex items-center gap-3">
              <Skeleton class="h-9 w-9 rounded-full" />
              <Skeleton class="h-4 w-[120px]" />
            </div>
          </TableCell>
          <TableCell><Skeleton class="h-4 w-[180px]" /></TableCell>
          <TableCell><Skeleton class="h-5 w-[70px] rounded-full" /></TableCell>
          <TableCell><Skeleton class="h-5 w-[60px] rounded-full" /></TableCell>
          <TableCell><Skeleton class="h-4 w-[100px]" /></TableCell>
          <TableCell class="text-right"><Skeleton class="h-8 w-8 ml-auto" /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
