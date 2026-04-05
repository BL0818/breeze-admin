<script lang="ts" setup>
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <ol
    :class="cn('flex items-center gap-1.5 text-sm text-muted-foreground sm:gap-2.5 overflow-hidden min-w-0 flex-nowrap', props.class)"
  >
    <slot />
  </ol>
</template>
