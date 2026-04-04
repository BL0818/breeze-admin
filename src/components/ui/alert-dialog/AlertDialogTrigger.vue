<script setup lang="ts">
import type { AlertDialogTriggerProps } from 'reka-ui'
import { AlertDialogTrigger as AlertDialogTriggerPrimitive } from 'reka-ui'

const props = defineProps<AlertDialogTriggerProps>()
</script>

<template>
  <AlertDialogTriggerPrimitive v-bind="props">
    <slot />
  </AlertDialogTriggerPrimitive>
</template>
