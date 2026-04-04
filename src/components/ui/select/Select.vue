<script setup lang="ts">
import { SelectRoot as RkSelect } from "reka-ui"

const { modelValue } = defineProps<{
  modelValue?: any
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()
</script>

<template>
  <RkSelect
    :model-value="modelValue"
    @update:model-value="emits('update:modelValue', $event)"
  >
    <slot />
  </RkSelect>
</template>
