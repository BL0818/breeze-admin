<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next'

const appTitle = import.meta.env.VITE_APP_TITLE || 'BreezeAdmin'
</script>

<template>
  <footer
    class="flex items-center justify-center bg-background px-4 text-sm text-muted-foreground shadow-[0_-1px_3px_rgba(0,0,0,0.06)]"
    :style="{ height: 'var(--footer-height)' }"
  >
    <a
      href="https://docs.breezeui.cn/"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
    >
      <span>{{ appTitle }} Docs</span>
      <ExternalLink class="h-3.5 w-3.5" />
    </a>
  </footer>
</template>
