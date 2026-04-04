<script setup lang="ts">
import { useProgress } from '@/composables/use-progress'

const { progress, failed } = useProgress()
</script>

<template>
  <div class="loading-bar-container">
    <div
      class="loading-bar"
      :class="{ 'loading-bar--failed': failed }"
      :style="{ width: progress + '%', opacity: progress > 0 ? 1 : 0 }"
    >
      <div class="loading-bar-shimmer" />
    </div>
  </div>
</template>

<style scoped>
.loading-bar-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  height: 2px;
  pointer-events: none;
}

.loading-bar {
  height: 100%;
  background: hsl(var(--primary));
  transition: width 0.2s ease, opacity 0.4s ease;
  box-shadow: 0 0 8px hsl(var(--primary) / 0.4);
  position: relative;
  overflow: hidden;
}

.loading-bar--failed {
  background: hsl(var(--destructive));
  box-shadow: 0 0 8px hsl(var(--destructive) / 0.4);
}

.loading-bar-shimmer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    hsl(var(--primary) / 0.3) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s infinite;
}

.loading-bar--failed .loading-bar-shimmer {
  background: linear-gradient(
    90deg,
    transparent 0%,
    hsl(var(--destructive) / 0.3) 50%,
    transparent 100%
  );
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
