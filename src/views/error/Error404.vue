<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import { Home } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="text-center space-y-4">
      <h1 class="text-6xl font-bold">404</h1>
      <p class="text-xl text-muted-foreground">{{ t('errors.notFound') }}</p>
      <Button @click="router.push('/')">
        <Home class="mr-2 h-4 w-4" />
        {{ t('common.backToDashboard') }}
      </Button>
    </div>
  </div>
</template>
