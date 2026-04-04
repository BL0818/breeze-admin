<script setup lang="ts">
import type { AlertDialogTitleProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { AlertDialogTitle as AlertDialogTitlePrimitive } from 'reka-ui'

interface AlertDialogTitlePropsExtended extends AlertDialogTitleProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<AlertDialogTitlePropsExtended>()
</script>

<template>
  <AlertDialogTitlePrimitive :class="cn('text-lg font-semibold', props.class)">
    <slot />
  </AlertDialogTitlePrimitive>
</template>
