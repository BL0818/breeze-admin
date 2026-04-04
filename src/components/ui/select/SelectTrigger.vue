<script setup lang="ts">
import type { SelectTriggerProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { SelectTrigger as RkSelectTrigger, useForwardProps } from "reka-ui"
import { ChevronDown } from "lucide-vue-next"
import { cn } from "@/lib/utils"

const props = withDefaults(defineProps<SelectTriggerProps & { class?: HTMLAttributes["class"] }>(), {
  asChild: true,
})

const delegatedProps = reactiveOmit(props, "class")
const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <RkSelectTrigger v-bind="forwarded">
    <button
      type="button"
      :class="cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        props.class
      )"
    >
      <slot />
      <ChevronDown class="h-4 w-4 opacity-50 shrink-0" />
    </button>
  </RkSelectTrigger>
</template>
