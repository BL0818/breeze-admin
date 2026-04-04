<script setup lang="ts">
import { computed } from 'vue'
import { Palette, RotateCcw, Check } from 'lucide-vue-next'
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useThemeStore, THEME_PRESETS } from '@/stores/theme'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const themeStore = useThemeStore()

// ==================== 颜色相关 ====================
const primaryColor = computed({
  get: () => themeStore.primaryColor,
  set: (v: string) => themeStore.setPrimaryColor(v),
})
const successColor = computed({
  get: () => themeStore.successColor,
  set: (v: string) => themeStore.setSuccessColor(v),
})
const warningColor = computed({
  get: () => themeStore.warningColor,
  set: (v: string) => themeStore.setWarningColor(v),
})
const errorColor = computed({
  get: () => themeStore.errorColor,
  set: (v: string) => themeStore.setErrorColor(v),
})

// ==================== 布局相关 ====================
const showTabsBar = computed({
  get: () => themeStore.showTabsBar,
  set: (v: boolean) => { themeStore.showTabsBar = v },
})
const tabsKeepAlive = computed({
  get: () => themeStore.tabsKeepAlive,
  set: (v: boolean) => { themeStore.tabsKeepAlive = v },
})
const tabsMiddleClickClose = computed({
  get: () => themeStore.tabsMiddleClickClose,
  set: (v: boolean) => { themeStore.tabsMiddleClickClose = v },
})
const showBreadcrumb = computed({
  get: () => themeStore.showBreadcrumb,
  set: (v: boolean) => { themeStore.showBreadcrumb = v },
})
const showBreadcrumbIcon = computed({
  get: () => themeStore.showBreadcrumbIcon,
  set: (v: boolean) => { themeStore.showBreadcrumbIcon = v },
})
const sidebarWidth = computed({
  get: () => themeStore.sidebarWidth,
  set: (v: number) => { themeStore.sidebarWidth = v },
})
const sidebarCollapsedWidth = computed({
  get: () => themeStore.sidebarCollapsedWidth,
  set: (v: number) => { themeStore.sidebarCollapsedWidth = v },
})
const showFooter = computed({
  get: () => themeStore.showFooter,
  set: (v: boolean) => { themeStore.showFooter = v },
})
const footerHeight = computed({
  get: () => themeStore.footerHeight,
  set: (v: number) => { themeStore.footerHeight = v },
})

// ==================== 通用相关 ====================
const showLanguageBtn = computed({
  get: () => themeStore.showLanguageBtn,
  set: (v: boolean) => { themeStore.showLanguageBtn = v },
})
const showThemeBtn = computed({
  get: () => themeStore.showThemeBtn,
  set: (v: boolean) => { themeStore.showThemeBtn = v },
})
const showFullscreenBtn = computed({
  get: () => themeStore.showFullscreenBtn,
  set: (v: boolean) => { themeStore.showFullscreenBtn = v },
})

// 预设色选中判断
function isPresetActive(presetPrimary: string): boolean {
  return themeStore.primaryColor.toLowerCase() === presetPrimary.toLowerCase()
}
</script>

<template>
  <SheetContent
    side="right"
    class="w-[380px] sm:max-w-[380px] p-0 flex flex-col overflow-hidden"
  >
    <SheetHeader class="px-6 pt-6 pb-4 border-b">
      <SheetTitle class="text-base">{{ t('themeSettings.title') }}</SheetTitle>
      <SheetDescription class="sr-only">{{ t('themeSettings.title') }}</SheetDescription>
    </SheetHeader>

    <div class="flex-1 overflow-y-auto px-6 py-4 space-y-6">

      <!-- ====== 外观 ====== -->
      <div class="space-y-3">
        <h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {{ t('themeSettings.appearance') }}
        </h4>
        <Separator />

        <!-- 预设主题色 -->
        <div class="space-y-2">
          <Label class="text-sm">{{ t('themeSettings.themeColor') }}</Label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="preset in THEME_PRESETS"
              :key="preset.id"
              @click="themeStore.setPrimaryColor(preset.primary)"
              class="w-8 h-8 rounded-full border-2 transition-all hover:scale-110"
              :class="isPresetActive(preset.primary) ? 'border-foreground ring-2 ring-foreground/20 scale-105' : 'border-transparent'"
              :style="{ backgroundColor: preset.primary }"
              :title="preset.id"
            >
              <Check v-if="isPresetActive(preset.primary)" class="w-4 h-4 text-white mx-auto" />
            </button>
            <!-- 自定义色 -->
            <div class="relative w-8 h-8 rounded-full border-2 border-dashed border-muted-foreground/40 flex items-center justify-center overflow-hidden">
              <Palette class="w-4 h-4 text-muted-foreground" />
              <input
                type="color"
                :value="themeStore.primaryColor"
                @input="(e: Event) => themeStore.setPrimaryColor((e.target as HTMLInputElement).value)"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <!-- 颜色配置行 -->
        <div class="flex items-center justify-between py-1">
          <Label class="text-sm">{{ t('themeSettings.primaryColor') }}</Label>
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded" :style="{ backgroundColor: primaryColor }" />
            <input type="color" v-model="primaryColor" class="w-7 h-7 cursor-pointer rounded border-0 p-0" />
          </div>
        </div>

        <!-- 信息色（只读） -->
        <div class="flex items-center justify-between py-1 opacity-60">
          <Label class="text-sm">{{ t('themeSettings.infoColor') }}</Label>
          <span class="text-xs text-muted-foreground">{{ t('themeSettings.infoColorFollowPrimary') }}</span>
        </div>

        <!-- 成功色 -->
        <div class="flex items-center justify-between py-1">
          <Label class="text-sm">{{ t('themeSettings.successColor') }}</Label>
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded" :style="{ backgroundColor: successColor }" />
            <input type="color" v-model="successColor" class="w-7 h-7 cursor-pointer rounded border-0 p-0" />
          </div>
        </div>

        <!-- 警告色 -->
        <div class="flex items-center justify-between py-1">
          <Label class="text-sm">{{ t('themeSettings.warningColor') }}</Label>
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded" :style="{ backgroundColor: warningColor }" />
            <input type="color" v-model="warningColor" class="w-7 h-7 cursor-pointer rounded border-0 p-0" />
          </div>
        </div>

        <!-- 错误色 -->
        <div class="flex items-center justify-between py-1">
          <Label class="text-sm">{{ t('themeSettings.errorColor') }}</Label>
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded" :style="{ backgroundColor: errorColor }" />
            <input type="color" v-model="errorColor" class="w-7 h-7 cursor-pointer rounded border-0 p-0" />
          </div>
        </div>

        <Button variant="outline" size="sm" class="w-full" @click="themeStore.resetColors">
          <RotateCcw class="w-3.5 h-3.5 mr-1.5" />
          {{ t('themeSettings.resetColors') }}
        </Button>
      </div>

      <Separator />

      <!-- ====== 布局 ====== -->
      <div class="space-y-4">
        <h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {{ t('themeSettings.layout') }}
        </h4>

        <!-- 标签栏设置 -->
        <div class="space-y-2">
          <Label class="text-sm font-medium">{{ t('themeSettings.tabsBarSettings') }}</Label>
          <div class="flex items-center justify-between py-1">
            <span class="text-sm text-muted-foreground">{{ t('themeSettings.showTabsBar') }}</span>
            <Switch v-model="showTabsBar" />
          </div>
          <div class="flex items-center justify-between py-1">
            <span class="text-sm text-muted-foreground">{{ t('themeSettings.tabsKeepAlive') }}</span>
            <Switch v-model="tabsKeepAlive" />
          </div>
          <div class="flex items-center justify-between py-1">
            <span class="text-sm text-muted-foreground">{{ t('themeSettings.tabsMiddleClickClose') }}</span>
            <Switch v-model="tabsMiddleClickClose" />
          </div>
        </div>

        <!-- 头部设置 -->
        <div class="space-y-2">
          <Label class="text-sm font-medium">{{ t('themeSettings.headerSettings') }}</Label>
          <div class="flex items-center justify-between py-1">
            <span class="text-sm text-muted-foreground">{{ t('themeSettings.showBreadcrumb') }}</span>
            <Switch v-model="showBreadcrumb" />
          </div>
          <div class="flex items-center justify-between py-1">
            <span class="text-sm text-muted-foreground">{{ t('themeSettings.showBreadcrumbIcon') }}</span>
            <Switch v-model="showBreadcrumbIcon" />
          </div>
        </div>

        <!-- 侧边栏设置 -->
        <div class="space-y-2">
          <Label class="text-sm font-medium">{{ t('themeSettings.sidebarSettings') }}</Label>
          <div class="space-y-2 py-1">
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">{{ t('themeSettings.sidebarWidth') }}</span>
              <span class="text-xs font-mono text-muted-foreground w-14 text-right">{{ sidebarWidth }}px</span>
            </div>
            <input
              type="range"
              v-model.number="sidebarWidth"
              min="180" max="360" step="10"
              class="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted accent-primary"
            />
          </div>
          <div class="space-y-2 py-1">
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">{{ t('themeSettings.sidebarCollapsedWidth') }}</span>
              <span class="text-xs font-mono text-muted-foreground w-14 text-right">{{ sidebarCollapsedWidth }}px</span>
            </div>
            <input
              type="range"
              v-model.number="sidebarCollapsedWidth"
              min="48" max="120" step="4"
              class="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted accent-primary"
            />
          </div>
        </div>

        <!-- 底部设置 -->
        <div class="space-y-2">
          <Label class="text-sm font-medium">{{ t('themeSettings.footerSettings') }}</Label>
          <div class="flex items-center justify-between py-1">
            <span class="text-sm text-muted-foreground">{{ t('themeSettings.showFooter') }}</span>
            <Switch v-model="showFooter" />
          </div>
          <div class="space-y-2 py-1">
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">{{ t('themeSettings.footerHeight') }}</span>
              <span class="text-xs font-mono text-muted-foreground w-14 text-right">{{ footerHeight }}px</span>
            </div>
            <input
              type="range"
              v-model.number="footerHeight"
              min="24" max="80" step="4"
              class="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted accent-primary"
            />
          </div>
        </div>
      </div>

      <Separator />

      <!-- ====== 通用 ====== -->
      <div class="space-y-4">
        <h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {{ t('themeSettings.general') }}
        </h4>

        <div class="space-y-2">
          <Label class="text-sm font-medium">{{ t('themeSettings.generalSettings') }}</Label>
          <div class="flex items-center justify-between py-1">
            <span class="text-sm text-muted-foreground">{{ t('themeSettings.showLanguageBtn') }}</span>
            <Switch v-model="showLanguageBtn" />
          </div>
          <div class="flex items-center justify-between py-1">
            <span class="text-sm text-muted-foreground">{{ t('themeSettings.showThemeBtn') }}</span>
            <Switch v-model="showThemeBtn" />
          </div>
          <div class="flex items-center justify-between py-1">
            <span class="text-sm text-muted-foreground">{{ t('themeSettings.showFullscreenBtn') }}</span>
            <Switch v-model="showFullscreenBtn" />
          </div>
        </div>
      </div>

    </div>
  </SheetContent>
</template>
