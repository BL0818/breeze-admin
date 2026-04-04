<script setup lang="ts">
import type { AlertDialogCancelProps } from 'reka-ui'
import { AlertDialogCancel as AlertDialogCancelPrimitive } from 'reka-ui'

const props = defineProps<AlertDialogCancelProps>()
</script>

<template>
  <AlertDialogCancelPrimitive v-bind="props">
    <slot />
  </AlertDialogCancelPrimitive>
</template>
