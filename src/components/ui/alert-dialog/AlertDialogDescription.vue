<script setup lang="ts">
import type { AlertDialogDescriptionProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { AlertDialogDescription as AlertDialogDescriptionPrimitive } from 'reka-ui'

interface AlertDialogDescriptionPropsExtended extends AlertDialogDescriptionProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<AlertDialogDescriptionPropsExtended>()
</script>

<template>
  <AlertDialogDescriptionPrimitive :class="cn('text-sm text-muted-foreground', props.class)">
    <slot />
  </AlertDialogDescriptionPrimitive>
</template>
