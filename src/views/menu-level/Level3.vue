<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Layers, FolderTree, File } from 'lucide-vue-next'

const { t } = useI18n()
</script>

<template>
  <div class="space-y-6 p-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">{{ t('nav.menuLevel3') }}</h1>
      <p class="text-muted-foreground mt-1">
        这是一个三级菜单示例页面，展示多级嵌套路由的导航能力。
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader class="flex flex-row items-center gap-4">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Layers class="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle class="text-base">一级菜单</CardTitle>
            <CardDescription>menu-level</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            顶层路由容器，定义第一级导航入口。仅作为分组使用，自动重定向到第一个子路由。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center gap-4">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FolderTree class="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle class="text-base">二级菜单</CardTitle>
            <CardDescription>menu-level/level2</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            中间层路由容器，可以继续嵌套子路由，也可以包含自身的页面组件。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center gap-4">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <File class="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle class="text-base">三级菜单</CardTitle>
            <CardDescription>menu-level/level2/level3</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            叶子路由，即当前页面。侧边栏支持最多三级嵌套导航。
          </p>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>路由结构说明</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-3 text-sm">
          <div class="flex items-center gap-2">
            <Badge variant="outline">/menu-level</Badge>
            <span class="text-muted-foreground">一级路由 - 重定向到子路由</span>
          </div>
          <div class="flex items-center gap-2 pl-6">
            <Badge variant="outline">/menu-level/level2</Badge>
            <span class="text-muted-foreground">二级路由 - 重定向到子路由</span>
          </div>
          <div class="flex items-center gap-2 pl-12">
            <Badge variant="outline">/menu-level/level2/level3</Badge>
            <span class="text-muted-foreground">三级路由 - 当前页面（Level3.vue）</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
