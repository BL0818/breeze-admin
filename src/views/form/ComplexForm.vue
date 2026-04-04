<script setup lang="ts">
import { ref, watch } from 'vue'
import { useForm } from '@vorms/core'
import * as z from 'zod'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { SwitchRoot } from 'reka-ui'
import { Loader2 } from 'lucide-vue-next'
import { FormInput } from 'lucide-vue-next'

const { t } = useI18n()

// Zod schema - use static strings for validation
const complexFormSchema = z.object({
  username: z
    .string()
    .min(3, 'username_min')
    .min(3, 'username_min'),
  email: z
    .string()
    .email('email_invalid'),
  password: z
    .string()
    .min(8, 'password_min')
    .regex(/[a-zA-Z]/, 'password_letter')
    .regex(/[0-9]/, 'password_number'),
  confirmPassword: z.string(),
  role: z.enum(['admin', 'manager', 'user'], {
    required_error: 'role_required'
  }),
  autoReply: z.boolean().default(false),
  bio: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'password_mismatch',
  path: ['confirmPassword']
}).refine((data) => {
  if (data.autoReply && (!data.bio || data.bio.trim() === '')) {
    return false
  }
  return true
}, {
  message: 'bio_required',
  path: ['bio']
})

type ComplexFormData = z.infer<typeof complexFormSchema>

// Error message translator for Zod errors
const translateError = (message: string): string => {
  const errorMap: Record<string, string> = {
    'username_min': t('complexForm.usernameMinError'),
    'email_invalid': t('complexForm.emailError'),
    'password_min': t('complexForm.passwordMinError'),
    'password_letter': t('complexForm.passwordLetterError'),
    'password_number': t('complexForm.passwordNumberError'),
    'password_mismatch': t('complexForm.passwordMismatch'),
    'role_required': t('complexForm.roleRequired'),
    'bio_required': t('complexForm.bioRequired')
  }
  return errorMap[message] || message
}

const {
  register,
  errors,
  values,
  validateForm,
  setFieldValue,
  resetForm
} = useForm<ComplexFormData>({
  initialValues: {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as const,
    autoReply: false,
    bio: ''
  },
  validate: (values) => {
    const result = complexFormSchema.safeParse(values)
    if (result.success) return {}
    const fieldErrors: Record<string, string> = {}
    result.error.errors.forEach((err) => {
      const path = err.path[0] as string
      if (!fieldErrors[path]) {
        fieldErrors[path] = translateError(err.message)
      }
    })
    return fieldErrors
  },
  onSubmit: async (formValues) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success(t('complexForm.submitSuccess'), {
      description: t('complexForm.submitSuccessDesc', { username: formValues.username, role: t(`complexForm.${formValues.role}`) })
    })
  }
})

const usernameField = register('username')
const emailField = register('email')
const passwordField = register('password')
const confirmPasswordField = register('confirmPassword')


const isSubmitting = ref(false)

watch(() => values.autoReply, () => {
  if (values.autoReply && values.bio) {
    validateForm()
  }
})

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  isSubmitting.value = true

  const formErrors = await validateForm()
  const hasErrors = Object.keys(formErrors).length > 0

  if (hasErrors) {
    toast.error(t('complexForm.fixErrors'))
    isSubmitting.value = false
    return
  }

  await new Promise(resolve => setTimeout(resolve, 1000))

  toast.success(t('complexForm.submitSuccess'), {
    description: t('complexForm.submitSuccessDesc', { username: values.username, role: t(`complexForm.${values.role}`) })
  })

  isSubmitting.value = false
}

const handleReset = () => {
  resetForm()
}
</script>

<template>
  <div class="container mx-auto py-8 px-4 max-w-2xl">
    <Card class="w-full">
      <CardHeader>
        <div class="flex items-center gap-3">
          <FormInput class="h-8 w-8 text-primary" />
          <div>
            <CardTitle>{{ t('complexForm.title') }}</CardTitle>
            <CardDescription>{{ t('complexForm.description') }}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <form @submit="handleSubmit">
        <CardContent class="space-y-6">
          <!-- Username -->
          <div class="space-y-2">
            <Label for="username">{{ t('complexForm.username') }}</Label>
            <Input
              id="username"
              :placeholder="t('complexForm.usernamePlaceholder')"
              v-model="values.username"
              v-bind="usernameField.attrs"
            />
            <p v-if="errors.username" class="text-sm text-destructive">{{ errors.username }}</p>
          </div>

          <!-- Email -->
          <div class="space-y-2">
            <Label for="email">{{ t('complexForm.email') }}</Label>
            <Input
              id="email"
              type="email"
              :placeholder="t('complexForm.emailPlaceholder')"
              v-model="values.email"
              v-bind="emailField.attrs"
            />
            <p v-if="errors.email" class="text-sm text-destructive">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <Label for="password">{{ t('complexForm.password') }}</Label>
            <Input
              id="password"
              type="password"
              :placeholder="t('complexForm.passwordPlaceholder')"
              v-model="values.password"
              v-bind="passwordField.attrs"
            />
            <p v-if="errors.password" class="text-sm text-destructive">{{ errors.password }}</p>
          </div>

          <!-- Confirm Password -->
          <div class="space-y-2">
            <Label for="confirmPassword">{{ t('complexForm.confirmPassword') }}</Label>
            <Input
              id="confirmPassword"
              type="password"
              :placeholder="t('complexForm.confirmPasswordPlaceholder')"
              v-model="values.confirmPassword"
              v-bind="confirmPasswordField.attrs"
            />
            <p v-if="errors.confirmPassword" class="text-sm text-destructive">{{ errors.confirmPassword }}</p>
          </div>

          <!-- Role Select -->
          <div class="space-y-2">
            <Label for="role">{{ t('complexForm.role') }}</Label>
            <Select v-model="values.role" @update:model-value="(val) => setFieldValue('role', val as 'admin' | 'manager' | 'user')">
              <SelectTrigger>
                <SelectValue :placeholder="t('complexForm.selectRole')" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{{ t('complexForm.rolesLabel') }}</SelectLabel>
                  <SelectItem value="admin">{{ t('complexForm.admin') }}</SelectItem>
                  <SelectItem value="manager">{{ t('complexForm.manager') }}</SelectItem>
                  <SelectItem value="user">{{ t('complexForm.user') }}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p v-if="errors.role" class="text-sm text-destructive">{{ errors.role }}</p>
          </div>

          <!-- Auto Reply Switch -->
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <Label for="autoReply">{{ t('complexForm.autoReply') }}</Label>
              <p class="text-sm text-muted-foreground">{{ t('complexForm.autoReplyHint') }}</p>
            </div>
            <SwitchRoot
              id="autoReply"
              v-model:model-value="values.autoReply"
              @update:model-value="(val) => setFieldValue('autoReply', val)"
              class="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input cursor-pointer"
            />
          </div>

          <!-- Bio (conditional) -->
          <div v-if="values.autoReply" class="space-y-2 animate-in slide-in-from-top-2 duration-200">
            <Label for="bio">{{ t('complexForm.bio') }}</Label>
            <textarea
              id="bio"
              class="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              :placeholder="t('complexForm.bioPlaceholder')"
              :value="values.bio ?? ''"
              @input="(e: Event) => setFieldValue('bio', (e.target as HTMLTextAreaElement).value)"
            ></textarea>
            <p v-if="errors.bio" class="text-sm text-destructive">{{ errors.bio }}</p>
          </div>
        </CardContent>

        <CardFooter class="flex justify-between">
          <Button type="button" variant="outline" @click="handleReset">
            {{ t('complexForm.reset') }}
          </Button>
          <Button type="submit" :disabled="isSubmitting">
            <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            {{ isSubmitting ? t('complexForm.submitting') : t('complexForm.submit') }}
          </Button>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>
