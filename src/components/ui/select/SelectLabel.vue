<script setup lang="ts">
import type { SelectLabelProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { SelectLabel } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<SelectLabelProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <SelectLabel
    v-bind="delegatedProps"
    :class="cn('py-1.5 pl-8 pr-2 text-sm font-semibold', props.class)"
  >
    <slot />
  </SelectLabel>
</template>
