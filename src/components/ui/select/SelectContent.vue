<script setup lang="ts">
import type { SelectContentEmits, SelectContentProps } from "reka-ui"
import { reactiveOmit } from "@vueuse/core"
import { SelectContent, SelectPortal, SelectViewport, useForwardPropsEmits } from "reka-ui"
import { cn } from "@/lib/utils"

const props = withDefaults(defineProps<SelectContentProps & { class?: string }>(), {
  position: "popper" as const,
})
const emits = defineEmits<SelectContentEmits>()

const delegatedProps = reactiveOmit(props, "class")
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <SelectPortal>
    <SelectContent
      v-bind="forwarded"
      :class="cn(
        'relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        props.class
      )"
    >
      <SelectViewport>
        <slot />
      </SelectViewport>
    </SelectContent>
  </SelectPortal>
</template>
