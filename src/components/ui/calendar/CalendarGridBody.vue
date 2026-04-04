<script setup lang="ts">
import { CalendarGridBody, useForwardProps, type CalendarGridBodyProps } from 'reka-ui'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<CalendarGridBodyProps & { class?: HTMLAttributes['class'] }>()

const forwardedProps = useForwardProps(props)
</script>

<template>
  <CalendarGridBody
    :class="cn('', props.class)"
    v-bind="forwardedProps"
  >
    <slot />
  </CalendarGridBody>
</template>
