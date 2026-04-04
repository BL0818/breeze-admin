<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRequest } from 'alova'
import { exampleApi } from '@/api'
import { BusinessError } from '@/utils/request'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Send,
  Plus,
  Pencil,
  Trash2,
  Zap,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock,
  Activity,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

const { t } = useI18n()

// ======================== 拦截器日志 ========================
interface InterceptorLog {
  id: number
  type: 'request' | 'response' | 'error'
  message: string
  timestamp: string
}

let logIdCounter = 0
const interceptorLogs = ref<InterceptorLog[]>([])

function addLog(type: InterceptorLog['type'], message: string) {
  logIdCounter++
  interceptorLogs.value.unshift({
    id: logIdCounter,
    type,
    message,
    timestamp: new Date().toLocaleTimeString(),
  })
  // 最多保留 50 条
  if (interceptorLogs.value.length > 50) {
    interceptorLogs.value.pop()
  }
}

// ======================== GET 请求 ========================
const getRequest = useRequest(exampleApi.getList, { immediate: false })

const sendGet = async () => {
  addLog('request', 'GET /api/examples/list')
  try {
    const data = await getRequest.send()
    addLog('response', `GET 成功 — 返回 ${Array.isArray(data) ? data.length : 0} 条记录`)
  } catch (err) {
    addLog('error', `GET 失败 — ${err instanceof Error ? err.message : '未知错误'}`)
  }
}

// ======================== POST 请求 ========================
const postForm = ref({ name: '', email: '' })
const postRequest = useRequest(
  () => exampleApi.createItem(postForm.value.name, postForm.value.email),
  { immediate: false },
)
const postResult = ref<unknown>(null)

const sendPost = async () => {
  if (!postForm.value.name.trim()) {
    toast.error(t('requestExamples.nameRequired'))
    return
  }
  addLog('request', `POST /api/examples/create — { name: "${postForm.value.name}", email: "${postForm.value.email}" }`)
  try {
    const data = await postRequest.send()
    postResult.value = data
    addLog('response', `POST 成功 — 创建资源 ID: ${(data as Record<string, unknown>)?.id}`)
    toast.success(t('requestExamples.createSuccess'))
  } catch (err) {
    addLog('error', `POST 失败 — ${err instanceof Error ? err.message : '未知错误'}`)
  }
}

// ======================== PUT 请求 ========================
const putForm = ref({ id: '1', name: '', age: '' })
const putRequest = useRequest(
  () => exampleApi.updateItem(putForm.value.id, putForm.value.name, Number(putForm.value.age)),
  { immediate: false },
)
const putResult = ref<unknown>(null)

const sendPut = async () => {
  if (!putForm.value.name.trim()) {
    toast.error(t('requestExamples.nameRequired'))
    return
  }
  addLog('request', `PUT /api/examples/update/${putForm.value.id} — { name: "${putForm.value.name}", age: ${putForm.value.age} }`)
  try {
    const data = await putRequest.send()
    putResult.value = data
    addLog('response', `PUT 成功 — 更新资源 ID: ${(data as Record<string, unknown>)?.id}`)
    toast.success(t('requestExamples.updateSuccess'))
  } catch (err) {
    addLog('error', `PUT 失败 — ${err instanceof Error ? err.message : '未知错误'}`)
  }
}

// ======================== DELETE 请求 ========================
const deleteId = ref('1')
const deleteRequest = useRequest(
  () => exampleApi.deleteItem(deleteId.value),
  { immediate: false },
)
const deleteResult = ref<unknown>(null)

const sendDelete = async () => {
  if (!deleteId.value.trim()) {
    toast.error(t('requestExamples.idRequired'))
    return
  }
  addLog('request', `DELETE /api/examples/delete/${deleteId.value}`)
  try {
    const data = await deleteRequest.send()
    deleteResult.value = data
    addLog('response', `DELETE 成功 — 资源 ${deleteId.value} 已删除`)
    toast.success(t('requestExamples.deleteSuccess'))
  } catch (err) {
    addLog('error', `DELETE 失败 — ${err instanceof Error ? err.message : '未知错误'}`)
  }
}

// ======================== 并发请求 ========================
const concurrentLoading = ref(false)
const concurrentResults = ref<{
  a: { totalUsers: number; activeUsers: number } | null
  b: { totalOrders: number; revenue: number } | null
  c: { cpu: string; memory: string } | null
}>({ a: null, b: null, c: null })

const sendConcurrent = async () => {
  concurrentLoading.value = true
  addLog('request', '并发请求 — 同时发起 3 个 GET 请求')
  try {
    const [a, b, c] = await Promise.all([
      exampleApi.getConcurrentA().send(),
      exampleApi.getConcurrentB().send(),
      exampleApi.getConcurrentC().send(),
    ])
    concurrentResults.value = { a, b, c }
    addLog('response', '并发请求完成 — 3 个请求全部成功')
  } catch (err) {
    addLog('error', `并发请求失败 — ${err instanceof Error ? err.message : '未知错误'}`)
  } finally {
    concurrentLoading.value = false
  }
}

// ======================== 错误处理 ========================
const errorResult = ref<{ type: string; message: string } | null>(null)
const errorLoading = ref(false)

const sendError = async (type: '404' | '500' | 'business') => {
  errorResult.value = null
  errorLoading.value = true
  addLog('request', `GET /api/examples/error/${type}`)
  try {
    if (type === '404') {
      await exampleApi.getError404().send()
    } else if (type === '500') {
      await exampleApi.getError500().send()
    } else {
      await exampleApi.getErrorBusiness().send()
    }
  } catch (err) {
    if (err instanceof BusinessError) {
      errorResult.value = {
        type: `BusinessError (${err.code})`,
        message: err.message,
      }
      addLog('error', `业务异常 [${err.code}] — ${err.message}`)
    } else {
      errorResult.value = {
        type: err instanceof Error ? err.constructor.name : 'Error',
        message: err instanceof Error ? err.message : String(err),
      }
      addLog('error', `HTTP 错误 — ${err instanceof Error ? err.message : '未知错误'}`)
    }
  } finally {
    errorLoading.value = false
  }
}

// ======================== 初始化 ========================
onMounted(() => {
  addLog('response', '页面已加载，请求拦截器就绪')
})

// 响应结果格式化
function formatJson(data: unknown): string {
  return JSON.stringify(data, null, 2)
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">{{ t('requestExamples.title') }}</h2>
        <p class="text-muted-foreground">{{ t('requestExamples.description') }}</p>
      </div>
    </div>

    <!-- 上方：基础请求卡片 -->
    <div class="grid gap-6 md:grid-cols-2">
      <!-- GET 请求 -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <ArrowDownToLine class="h-5 w-5 text-blue-500" />
            GET {{ t('requestExamples.getRequest') }}
          </CardTitle>
          <CardDescription>{{ t('requestExamples.getDesc') }}</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <Button :disabled="getRequest.loading.value" @click="sendGet">
            <Loader2 v-if="getRequest.loading.value" class="mr-2 h-4 w-4 animate-spin" />
            <Send v-else class="mr-2 h-4 w-4" />
            {{ getRequest.loading.value ? t('requestExamples.loading') : t('requestExamples.sendRequest') }}
          </Button>
          <div v-if="getRequest.loading.value" class="space-y-2">
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-4 w-3/4" />
            <Skeleton class="h-4 w-1/2" />
          </div>
          <div v-else-if="getRequest.data.value" class="rounded-lg bg-muted p-3">
            <pre class="text-xs overflow-x-auto whitespace-pre-wrap">{{ formatJson(getRequest.data.value) }}</pre>
          </div>
          <div v-else class="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            {{ t('requestExamples.clickToSend') }}
          </div>
        </CardContent>
      </Card>

      <!-- POST 请求 -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Plus class="h-5 w-5 text-green-500" />
            POST {{ t('requestExamples.postRequest') }}
          </CardTitle>
          <CardDescription>{{ t('requestExamples.postDesc') }}</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-3">
            <div class="space-y-1.5">
              <Label>{{ t('requestExamples.name') }}</Label>
              <Input v-model="postForm.name" :placeholder="t('requestExamples.namePlaceholder')" />
            </div>
            <div class="space-y-1.5">
              <Label>{{ t('requestExamples.email') }}</Label>
              <Input v-model="postForm.email" :placeholder="t('requestExamples.emailPlaceholder')" />
            </div>
          </div>
          <Button :disabled="postRequest.loading.value" @click="sendPost">
            <Loader2 v-if="postRequest.loading.value" class="mr-2 h-4 w-4 animate-spin" />
            <Plus v-else class="mr-2 h-4 w-4" />
            {{ postRequest.loading.value ? t('requestExamples.submitting') : t('requestExamples.submit') }}
          </Button>
          <div v-if="postResult" class="rounded-lg bg-muted p-3">
            <pre class="text-xs overflow-x-auto whitespace-pre-wrap">{{ formatJson(postResult) }}</pre>
          </div>
          <div v-else class="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            {{ t('requestExamples.fillAndSubmit') }}
          </div>
        </CardContent>
      </Card>

      <!-- PUT 请求 -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Pencil class="h-5 w-5 text-orange-500" />
            PUT {{ t('requestExamples.putRequest') }}
          </CardTitle>
          <CardDescription>{{ t('requestExamples.putDesc') }}</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-3">
            <div class="grid grid-cols-3 gap-3">
              <div class="space-y-1.5">
                <Label>ID</Label>
                <Input v-model="putForm.id" placeholder="1" />
              </div>
              <div class="col-span-2 space-y-1.5">
                <Label>{{ t('requestExamples.name') }}</Label>
                <Input v-model="putForm.name" :placeholder="t('requestExamples.namePlaceholder')" />
              </div>
            </div>
            <div class="space-y-1.5">
              <Label>{{ t('requestExamples.age') }}</Label>
              <Input v-model="putForm.age" type="number" :placeholder="t('requestExamples.agePlaceholder')" />
            </div>
          </div>
          <Button :disabled="putRequest.loading.value" @click="sendPut">
            <Loader2 v-if="putRequest.loading.value" class="mr-2 h-4 w-4 animate-spin" />
            <Pencil v-else class="mr-2 h-4 w-4" />
            {{ putRequest.loading.value ? t('requestExamples.updating') : t('requestExamples.update') }}
          </Button>
          <div v-if="putResult" class="rounded-lg bg-muted p-3">
            <pre class="text-xs overflow-x-auto whitespace-pre-wrap">{{ formatJson(putResult) }}</pre>
          </div>
          <div v-else class="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            {{ t('requestExamples.fillAndUpdate') }}
          </div>
        </CardContent>
      </Card>

      <!-- DELETE 请求 -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Trash2 class="h-5 w-5 text-red-500" />
            DELETE {{ t('requestExamples.deleteRequest') }}
          </CardTitle>
          <CardDescription>{{ t('requestExamples.deleteDesc') }}</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-1.5">
            <Label>ID</Label>
            <Input v-model="deleteId" :placeholder="t('requestExamples.idPlaceholder')" />
          </div>
          <Button variant="destructive" :disabled="deleteRequest.loading.value" @click="sendDelete">
            <Loader2 v-if="deleteRequest.loading.value" class="mr-2 h-4 w-4 animate-spin" />
            <Trash2 v-else class="mr-2 h-4 w-4" />
            {{ deleteRequest.loading.value ? t('requestExamples.deleting') : t('requestExamples.delete') }}
          </Button>
          <div v-if="deleteResult" class="rounded-lg bg-muted p-3">
            <pre class="text-xs overflow-x-auto whitespace-pre-wrap">{{ formatJson(deleteResult) }}</pre>
          </div>
          <div v-else class="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            {{ t('requestExamples.enterIdToDelete') }}
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 下方：并发请求 + 错误处理 -->
    <div class="grid gap-6 md:grid-cols-2">
      <!-- 并发请求 -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Zap class="h-5 w-5 text-yellow-500" />
            {{ t('requestExamples.concurrent') }}
          </CardTitle>
          <CardDescription>{{ t('requestExamples.concurrentDesc') }}</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <Button :disabled="concurrentLoading" @click="sendConcurrent">
            <Loader2 v-if="concurrentLoading" class="mr-2 h-4 w-4 animate-spin" />
            <Zap v-else class="mr-2 h-4 w-4" />
            {{ concurrentLoading ? t('requestExamples.loading') : t('requestExamples.sendConcurrent') }}
          </Button>

          <div v-if="concurrentLoading" class="space-y-2">
            <Skeleton class="h-16 w-full" />
            <Skeleton class="h-16 w-full" />
            <Skeleton class="h-16 w-full" />
          </div>

          <div v-else-if="concurrentResults.a || concurrentResults.b || concurrentResults.c" class="space-y-3">
            <div class="flex items-center gap-3 rounded-lg border p-3">
              <Users class="h-5 w-5 text-blue-500 shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="text-xs text-muted-foreground">{{ t('requestExamples.userStats') }}</p>
                <div v-if="concurrentResults.a" class="flex gap-3 text-sm">
                  <span>{{ t('requestExamples.totalUsers') }}: <strong>{{ concurrentResults.a.totalUsers.toLocaleString() }}</strong></span>
                  <span>{{ t('requestExamples.activeUsers') }}: <strong>{{ concurrentResults.a.activeUsers.toLocaleString() }}</strong></span>
                </div>
              </div>
              <Badge v-if="concurrentResults.a" class="bg-emerald-500 text-white">
                <CheckCircle2 class="mr-1 h-3 w-3" /> OK
              </Badge>
            </div>

            <div class="flex items-center gap-3 rounded-lg border p-3">
              <Activity class="h-5 w-5 text-purple-500 shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="text-xs text-muted-foreground">{{ t('requestExamples.orderStats') }}</p>
                <div v-if="concurrentResults.b" class="flex gap-3 text-sm">
                  <span>{{ t('requestExamples.totalOrders') }}: <strong>{{ concurrentResults.b.totalOrders.toLocaleString() }}</strong></span>
                  <span>{{ t('requestExamples.revenue') }}: <strong>¥{{ concurrentResults.b.revenue.toLocaleString() }}</strong></span>
                </div>
              </div>
              <Badge v-if="concurrentResults.b" class="bg-emerald-500 text-white">
                <CheckCircle2 class="mr-1 h-3 w-3" /> OK
              </Badge>
            </div>

            <div class="flex items-center gap-3 rounded-lg border p-3">
              <Clock class="h-5 w-5 text-orange-500 shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="text-xs text-muted-foreground">{{ t('requestExamples.systemStats') }}</p>
                <div v-if="concurrentResults.c" class="flex gap-3 text-sm">
                  <span>CPU: <strong>{{ concurrentResults.c.cpu }}</strong></span>
                  <span>{{ t('requestExamples.memory') }}: <strong>{{ concurrentResults.c.memory }}</strong></span>
                </div>
              </div>
              <Badge v-if="concurrentResults.c" class="bg-emerald-500 text-white">
                <CheckCircle2 class="mr-1 h-3 w-3" /> OK
              </Badge>
            </div>
          </div>

          <div v-else class="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            {{ t('requestExamples.clickForConcurrent') }}
          </div>
        </CardContent>
      </Card>

      <!-- 错误处理 -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <AlertTriangle class="h-5 w-5 text-red-500" />
            {{ t('requestExamples.errorHandling') }}
          </CardTitle>
          <CardDescription>{{ t('requestExamples.errorDesc') }}</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" :disabled="errorLoading" @click="sendError('404')">
              404 Not Found
            </Button>
            <Button variant="outline" size="sm" :disabled="errorLoading" @click="sendError('500')">
              500 Server Error
            </Button>
            <Button variant="outline" size="sm" :disabled="errorLoading" @click="sendError('business')">
              {{ t('requestExamples.businessError') }}
            </Button>
          </div>

          <div v-if="errorLoading" class="space-y-2">
            <Skeleton class="h-20 w-full" />
          </div>

          <div v-else-if="errorResult" class="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950">
            <div class="flex items-start gap-2">
              <XCircle class="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p class="text-sm font-medium text-red-700 dark:text-red-400">{{ errorResult.type }}</p>
                <p class="text-xs text-red-600 dark:text-red-300 mt-1">{{ errorResult.message }}</p>
              </div>
            </div>
          </div>

          <div v-else class="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            {{ t('requestExamples.clickToSimulate') }}
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 拦截器日志 -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <ArrowUpFromLine class="h-5 w-5 text-indigo-500" />
          {{ t('requestExamples.interceptorLog') }}
        </CardTitle>
        <CardDescription>{{ t('requestExamples.interceptorDesc') }}</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="interceptorLogs.length === 0" class="py-6 text-center text-sm text-muted-foreground">
          {{ t('requestExamples.noLogs') }}
        </div>
        <div v-else class="max-h-64 overflow-y-auto space-y-1.5">
          <div
            v-for="log in interceptorLogs"
            :key="log.id"
            class="flex items-center gap-2 rounded px-3 py-1.5 text-xs"
            :class="{
              'bg-blue-50 dark:bg-blue-950': log.type === 'request',
              'bg-emerald-50 dark:bg-emerald-950': log.type === 'response',
              'bg-red-50 dark:bg-red-950': log.type === 'error',
            }"
          >
            <Badge
              variant="outline"
              class="text-[10px] px-1.5 py-0 h-4 shrink-0"
              :class="{
                'border-blue-300 text-blue-600 dark:border-blue-700 dark:text-blue-400': log.type === 'request',
                'border-emerald-300 text-emerald-600 dark:border-emerald-700 dark:text-emerald-400': log.type === 'response',
                'border-red-300 text-red-600 dark:border-red-700 dark:text-red-400': log.type === 'error',
              }"
            >
              {{ log.type === 'request' ? 'REQ' : log.type === 'response' ? 'RES' : 'ERR' }}
            </Badge>
            <span class="text-muted-foreground shrink-0">{{ log.timestamp }}</span>
            <span class="truncate">{{ log.message }}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
