<script setup lang="ts">
import { CalendarGridHead, useForwardProps, type CalendarGridHeadProps } from 'reka-ui'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<CalendarGridHeadProps & { class?: HTMLAttributes['class'] }>()

const forwardedProps = useForwardProps(props)
</script>

<template>
  <CalendarGridHead
    :class="cn('', props.class)"
    v-bind="forwardedProps"
  >
    <slot />
  </CalendarGridHead>
</template>
