<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
</script>

<template>
  <Card>
    <CardContent class="p-6">
      <div class="flex items-center justify-between">
        <Skeleton class="h-12 w-12 rounded-lg" />
        <Skeleton class="h-4 w-16" />
      </div>
      <div class="mt-4 space-y-2">
        <Skeleton class="h-8 w-32" />
        <Skeleton class="h-4 w-24" />
      </div>
    </CardContent>
  </Card>
</template>
