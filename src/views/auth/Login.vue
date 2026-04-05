<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useForm } from '@vorms/core'
import * as z from 'zod'
import { useRequest } from 'alova'
import { authApi } from '@/api'
import { BusinessError } from '@/utils/request'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { useThemeStore } from '@/stores/theme'
import { useRouter } from 'vue-router'

const appTitle = import.meta.env.VITE_APP_TITLE || 'BreezeAdmin'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from 'vue-sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import ForgotPassword from './ForgotPassword.vue'
import { Sun, Moon, Monitor, Globe, User, Lock, Wind, Zap, Shield, Layers, AlertCircle, Loader2 } from 'lucide-vue-next'

import type { LoginData } from '@/types/api-schema'

const appStore = useAppStore()
const themeStore = useThemeStore()

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const loginSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

type LoginFormData = z.infer<typeof loginSchema>

const {
  register,
  errors,
  values,
  handleSubmit
} = useForm<LoginFormData>({
  initialValues: {
    username: '',
    password: ''
  },
  validate: (values) => {
    const result = loginSchema.safeParse(values)
    if (result.success) return {}
    const fieldErrors: Record<string, string> = {}
    result.error.errors.forEach((err) => {
      const path = err.path[0] as string
      fieldErrors[path] = err.message
    })
    return fieldErrors
  },
  onSubmit: async (formValues) => {
    errorMessage.value = ''

    try {
      const data = await loginRequest.send(formValues)
      authStore.setAuth(data as unknown as LoginData, rememberMe.value)
      router.push('/')
    } catch (err) {
      if (err instanceof BusinessError) {
        errorMessage.value = err.message || t('login.loginFailed')
      } else {
        errorMessage.value = t('login.anErrorOccurred')
      }
    }
  }
})

const usernameField = register('username')
const passwordField = register('password')

const rememberMe = ref(false)
const errorMessage = ref('')
const isLoaded = ref(false)

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})

// 使用 alova useRequest 管理登录请求（响应已由拦截器自动解包）
const loginRequest = useRequest(
  (values: { username: string; password: string }) =>
    authApi.login(values.username, values.password),
  {
    immediate: false
  }
)
</script>

<template>
  <div class="min-h-screen flex bg-background relative overflow-hidden">
    <!-- Top Right Controls -->
    <div class="absolute top-4 right-4 z-50 flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" class="bg-background/80 backdrop-blur-sm hover:bg-background/90">
            <Sun v-if="themeStore.themeMode === 'light'" class="h-5 w-5" />
            <Moon v-else-if="themeStore.themeMode === 'dark'" class="h-5 w-5" />
            <Monitor v-else class="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="themeStore.setTheme('light')" :class="{ 'bg-accent': themeStore.themeMode === 'light' }">
            <Sun class="mr-2 h-4 w-4" />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem @click="themeStore.setTheme('dark')" :class="{ 'bg-accent': themeStore.themeMode === 'dark' }">
            <Moon class="mr-2 h-4 w-4" />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem @click="themeStore.setTheme('system')" :class="{ 'bg-accent': themeStore.themeMode === 'system' }">
            <Monitor class="mr-2 h-4 w-4" />
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" class="bg-background/80 backdrop-blur-sm hover:bg-background/90">
            <Globe class="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="appStore.setLanguage('en')" :class="{ 'bg-accent': appStore.language === 'en' }">
            English
          </DropdownMenuItem>
          <DropdownMenuItem @click="appStore.setLanguage('zh')" :class="{ 'bg-accent': appStore.language === 'zh' }">
            中文
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <!-- Left Brand Panel -->
    <div
      class="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/90 via-primary/70 to-primary/50 dark:from-primary/80 dark:via-primary/60 dark:to-primary/40 p-12 flex-col justify-between transition-all duration-1000 ease-out"
      :class="isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'"
    >
      <!-- Animated Background Shapes -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute top-1/3 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
        <div class="absolute bottom-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
        <!-- Floating geometric shapes -->
        <div class="absolute top-20 left-20 w-4 h-4 bg-white/30 rotate-45 animate-bounce" style="animation-duration: 3s;"></div>
        <div class="absolute top-40 right-32 w-3 h-3 bg-white/20 rounded-full animate-bounce" style="animation-duration: 2.5s; animation-delay: 0.5s;"></div>
        <div class="absolute bottom-40 left-1/3 w-2 h-8 bg-white/20 animate-bounce" style="animation-duration: 4s; animation-delay: 1s;"></div>
        <div class="absolute top-1/2 right-1/4 w-6 h-6 border border-white/20 rotate-12 animate-bounce" style="animation-duration: 3.5s; animation-delay: 1.5s;"></div>
      </div>

      <!-- Brand Content -->
      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Wind class="w-7 h-7 text-white" />
          </div>
          <h1 class="text-4xl font-bold text-white tracking-tight">{{ appTitle }}</h1>
        </div>
        <p class="text-white/80 text-lg mt-2">{{ t('login.brandSlogan') || '轻盈·高效·优雅' }}</p>
      </div>

      <!-- Feature List -->
      <div class="relative z-10 space-y-6">
        <div class="flex items-center gap-4 text-white/90">
          <div class="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Zap class="w-5 h-5" />
          </div>
          <div>
            <h3 class="font-semibold">{{ t('login.feature1Title') || '闪电般的性能' }}</h3>
            <p class="text-sm text-white/60">{{ t('login.feature1Desc') || '基于现代前端技术栈，极速响应' }}</p>
          </div>
        </div>
        <div class="flex items-center gap-4 text-white/90">
          <div class="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Shield class="w-5 h-5" />
          </div>
          <div>
            <h3 class="font-semibold">{{ t('login.feature2Title') || '企业级安全' }}</h3>
            <p class="text-sm text-white/60">{{ t('login.feature2Desc') || '多层防护，保障数据安全' }}</p>
          </div>
        </div>
        <div class="flex items-center gap-4 text-white/90">
          <div class="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Layers class="w-5 h-5" />
          </div>
          <div>
            <h3 class="font-semibold">{{ t('login.feature3Title') || '模块化架构' }}</h3>
            <p class="text-sm text-white/60">{{ t('login.feature3Desc') || '灵活扩展，随心定制' }}</p>
          </div>
        </div>
      </div>

      <!-- Bottom tagline -->
      <div class="relative z-10 text-white/40 text-sm">
        <p>{{ t('login.copyright') || `© 2026 ${appTitle}. All rights reserved.` }}</p>
      </div>
    </div>

    <!-- Right Login Form Panel -->
    <div
      class="w-full lg:w-1/2 flex items-center justify-center p-8 transition-all duration-1000 ease-out"
      :class="isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'"
    >
      <div class="w-full max-w-md space-y-8">
        <!-- Mobile Logo -->
        <div class="lg:hidden text-center mb-8">
          <div class="inline-flex items-center gap-3">
            <div class="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
              <Wind class="w-7 h-7 text-primary" />
            </div>
            <h1 class="text-2xl font-bold">{{ appTitle }}</h1>
          </div>
        </div>

        <div class="text-center lg:text-left">
          <h2 class="text-3xl font-bold tracking-tight text-foreground">{{ t('login.signInToAccount') }}</h2>
          <p class="text-muted-foreground mt-2">{{ t('login.welcomeBack') || '欢迎回来，请登录您的账户' }}</p>
        </div>

        <Alert v-if="errorMessage" variant="destructive" class="animate-shake">
          <AlertCircle class="h-4 w-4" />
          <AlertTitle>{{ t('login.error') || '错误' }}</AlertTitle>
          <AlertDescription>{{ errorMessage }}</AlertDescription>
        </Alert>

        <form @submit="handleSubmit" class="space-y-5">
          <!-- Username Field -->
          <div class="space-y-2">
            <Label for="username" class="text-foreground font-medium">{{ t('login.username') }}</Label>
            <div class="relative">
              <User class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                id="username"
                class="pl-10 h-11 bg-background border-muted-foreground/20 focus:border-primary transition-colors"
                placeholder="admin"
                v-model="values.username"
                v-bind="usernameField.attrs"
              />
            </div>
            <p v-if="errors.username" class="text-sm text-destructive">{{ errors.username }}</p>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <Label for="password" class="text-foreground font-medium">{{ t('login.password') }}</Label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                id="password"
                type="password"
                class="pl-10 h-11 bg-background border-muted-foreground/20 focus:border-primary transition-colors"
                placeholder="admin123"
                v-model="values.password"
                v-bind="passwordField.attrs"
              />
            </div>
            <p v-if="errors.password" class="text-sm text-destructive">{{ errors.password }}</p>
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" v-model="rememberMe" class="rounded border-muted-foreground/30 text-primary focus:ring-primary" />
              <span class="text-muted-foreground">{{ t('login.rememberMe') || '记住我' }}</span>
            </label>
            <Sheet>
              <SheetTrigger as-child>
                <button type="button" class="text-sm text-primary hover:underline cursor-pointer bg-transparent border-none p-0">
                  {{ t('login.forgotPassword') || '忘记密码?' }}
                </button>
              </SheetTrigger>
              <SheetContent side="right" class="w-[400px] sm:max-w-[400px]">
                <SheetHeader>
                  <SheetTitle></SheetTitle>
                  <SheetDescription></SheetDescription>
                </SheetHeader>
                <div class="mt-6">
                  <ForgotPassword />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Button type="submit" size="lg" class="w-full h-11 text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" :disabled="loginRequest.loading.value">
            <Loader2 v-if="loginRequest.loading.value" class="mr-2 h-4 w-4 animate-spin" />
            {{ loginRequest.loading.value ? t('login.loggingIn') : t('login.signIn') }}
          </Button>
        </form>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-muted-foreground/20"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-background text-muted-foreground">{{ t('login.orContinueWith') || '或通过以下方式登录' }}</span>
          </div>
        </div>

        <!-- Social Login Buttons -->
        <div class="grid grid-cols-3 gap-3">
          <Button variant="outline" class="h-11 hover:bg-muted/50 transition-colors" @click="toast('Google 登录暂未开放', { description: '请联系管理员配置 OAuth2' })">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </Button>
          <Button variant="outline" class="h-11 hover:bg-muted/50 transition-colors" @click="toast('GitHub 登录暂未开放', { description: '请联系管理员配置 OAuth2' })">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
            </svg>
          </Button>
          <Button variant="outline" class="h-11 hover:bg-muted/50 transition-colors" @click="toast('X 登录暂未开放', { description: '请联系管理员配置 OAuth2' })">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </Button>
        </div>

        <div class="text-center text-sm text-muted-foreground">
          <p>{{ t('login.demoCredentials') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
</style>
