<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components'
import type { EChartsOption } from 'echarts'
import { useThemeStore } from '@/stores/theme'

// 注册 ECharts 组件
use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, GridComponent])

const props = defineProps<{
  data: { month: string; sales: number }[]
}>()

const themeStore = useThemeStore()

// 根据主题获取颜色 - 使用 indigo (4f46e5)
const chartColor = computed(() => {
  return themeStore.isDark ? '#818cf8' : 'rgb(99, 102, 241)'
})

const chartOptions = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: props.data.map(d => d.month)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Sales',
      type: 'line',
      smooth: true,
      data: props.data.map(d => d.sales),
      areaStyle: {
        color: chartColor.value.includes('rgb')
          ? 'rgba(99, 102, 241, 0.15)'
          : 'rgba(99, 102, 241, 0.15)'
      },
      itemStyle: {
        color: chartColor.value
      },
      lineStyle: {
        color: chartColor.value
      }
    }
  ]
}))
</script>

<template>
  <div class="h-[300px] w-full">
    <VChart :option="chartOptions" autoresize />
  </div>
</template>
