<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { TrendingUp, TrendingDown } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useCountUp } from '@/composables/use-count-up'

const props = defineProps<{
  title: string
  value: number
  change: number
  icon: typeof TrendingUp
}>()

const valueRef = toRef(props, 'value')
const isFirstLoad = ref(true)
const { displayValue, trigger } = useCountUp(valueRef, 1200, isFirstLoad)

// 首次数据到达时触发滚动动画
const handleAppear = () => {
  if (isFirstLoad.value) {
    isFirstLoad.value = false
    trigger()
  }
}

const isPositive = computed(() => props.change >= 0)

const formattedValue = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(displayValue.value)
})
</script>

<template>
  <Card @vue:mounted="handleAppear">
    <CardContent class="p-6">
      <div class="flex items-center justify-between">
        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <component :is="icon" class="h-6 w-6 text-primary" />
        </div>
        <div :class="cn(
          'flex items-center gap-1 text-sm font-medium',
          isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        )">
          <component :is="isPositive ? TrendingUp : TrendingDown" class="h-4 w-4" />
          {{ Math.abs(change) }}%
        </div>
      </div>
      <div class="mt-4">
        <p class="text-2xl font-bold">{{ formattedValue }}</p>
        <p class="text-sm text-muted-foreground">{{ title }}</p>
      </div>
    </CardContent>
  </Card>
</template>
