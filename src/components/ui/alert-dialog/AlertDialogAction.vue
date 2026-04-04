<script setup lang="ts">
import type { AlertDialogActionProps } from 'reka-ui'
import { AlertDialogAction as AlertDialogActionPrimitive } from 'reka-ui'

const props = defineProps<AlertDialogActionProps>()
</script>

<template>
  <AlertDialogActionPrimitive v-bind="props">
    <slot />
  </AlertDialogActionPrimitive>
</template>
