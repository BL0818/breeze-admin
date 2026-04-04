<script setup lang="ts">
import 'vue-sonner/style.css'
import { RouterView } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Toaster } from '@/components/ui/sonner'

const appStore = useAppStore()
const { locale } = useI18n()

// 监听主题变化，同步到 html 元素
watch(() => appStore.isDark, (isDark) => {
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}, { immediate: true })

// 监听语言变化，同步到 i18n
watch(() => appStore.language, (lang) => {
  locale.value = lang
}, { immediate: true })

onMounted(() => {
  // 确保初始状态同步
  if (appStore.isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  // 同步初始语言
  locale.value = appStore.language
})
</script>

<template>
  <RouterView />
  <Toaster position="top-right" />
</template>
