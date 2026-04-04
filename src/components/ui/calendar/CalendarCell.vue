<script setup lang="ts">
import { CalendarCell, useForwardProps, type CalendarCellProps } from 'reka-ui'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<CalendarCellProps & { class?: HTMLAttributes['class'] }>()

const forwardedProps = useForwardProps(props)
</script>

<template>
  <CalendarCell
    :class="cn(
      'relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([data-selected])]:rounded-md [&:has([data-selected])]:bg-accent [&:has([data-selected][data-outside-view])]:bg-accent/50',
      props.class
    )"
    v-bind="forwardedProps"
  >
    <slot />
  </CalendarCell>
</template>
