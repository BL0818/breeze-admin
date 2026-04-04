<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'alova'
import { authApi } from '@/api'
import { BusinessError } from '@/utils/request'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Mail, ArrowLeft } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const { t } = useI18n()

const email = ref('')
const isSuccess = ref(false)

const forgotPasswordRequest = useRequest(
  (emailValue: string) => authApi.forgotPassword(emailValue),
  { immediate: false }
)

const handleSubmit = async () => {
  if (!email.value) return

  try {
    await forgotPasswordRequest.send(email.value)
    isSuccess.value = true
    toast.success(t('login.resetPasswordSuccess') || '重置链接已发送', {
      description: t('login.resetPasswordEmailSent') || '请查收你的邮箱'
    })
  } catch (err) {
    if (err instanceof BusinessError) {
      toast.error(err.message || t('login.resetPasswordFailed') || '发送失败')
    } else {
      toast.error(t('login.anErrorOccurred') || '发生错误')
    }
  }
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="!isSuccess">
      <h3 class="text-lg font-semibold text-foreground mb-2">
        {{ t('login.forgotPassword') || '忘记密码' }}
      </h3>
      <p class="text-sm text-muted-foreground mb-6">
        {{ t('login.forgotPasswordDesc') || '输入你的邮箱地址，我们将发送重置链接' }}
      </p>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="reset-email" class="text-foreground">{{ t('login.email') || '邮箱' }}</Label>
          <div class="relative">
            <Mail class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="reset-email"
              type="email"
              v-model="email"
              :placeholder="t('login.enterEmail') || '请输入邮箱'"
              class="pl-10 h-11 bg-background border-muted-foreground/20 focus:border-primary transition-colors"
              required
            />
          </div>
        </div>
        <Button type="submit" size="lg" class="w-full h-11 text-base font-medium" :disabled="forgotPasswordRequest.loading.value">
          <Loader2 v-if="forgotPasswordRequest.loading.value" class="mr-2 h-4 w-4 animate-spin" />
          {{ forgotPasswordRequest.loading.value ? t('login.sending') || '发送中...' : (t('login.sendResetLink') || '发送重置链接') }}
        </Button>
      </form>
    </div>

    <div v-else class="text-center py-4">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <Mail class="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      <h3 class="text-lg font-semibold text-foreground mb-2">
        {{ t('login.resetLinkSent') || '重置链接已发送' }}
      </h3>
      <p class="text-sm text-muted-foreground mb-6">
        {{ t('login.resetLinkSentDesc') || '请前往邮箱查收重置链接，有效期 24 小时' }}
      </p>
      <Button variant="outline" @click="isSuccess = false" class="gap-2">
        <ArrowLeft class="h-4 w-4" />
        {{ t('login.backToForm') || '返回' }}
      </Button>
    </div>
  </div>
</template>
