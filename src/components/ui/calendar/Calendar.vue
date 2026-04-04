<script setup lang="ts">
import type { DateValue } from 'reka-ui'
import { CalendarRoot as CalendarPrimitive, type CalendarRootProps } from 'reka-ui'
import { cn } from '@/lib/utils'
import { useVModel } from '@vueuse/core'
import { computed, type HTMLAttributes } from 'vue'
import CalendarCell from './CalendarCell.vue'
import CalendarCellTrigger from './CalendarCellTrigger.vue'
import CalendarGrid from './CalendarGrid.vue'
import CalendarGridBody from './CalendarGridBody.vue'
import CalendarGridHead from './CalendarGridHead.vue'
import CalendarGridRow from './CalendarGridRow.vue'
import CalendarHeadCell from './CalendarHeadCell.vue'
import CalendarHeader from './CalendarHeader.vue'
import CalendarHeading from './CalendarHeading.vue'
import CalendarNextButton from './CalendarNextButton.vue'
import CalendarPrevButton from './CalendarPrevButton.vue'

const props = defineProps<CalendarRootProps & { class?: HTMLAttributes['class'] }>()

const emits = defineEmits<{
  'update:modelValue': [value: DateValue | undefined]
}>()

const modelValue = useVModel(props, 'modelValue', emits)

const delegatedProps = computed(() => {
  const { class: _, modelValue: __, ...delegated } = props
  return delegated
})
</script>

<template>
  <CalendarPrimitive
    v-slot="{ grid, weekDays }"
    v-model="modelValue"
    :class="cn('p-3', props.class)"
    v-bind="delegatedProps"
  >
    <CalendarHeader>
      <CalendarPrevButton />
      <CalendarHeading />
      <CalendarNextButton />
    </CalendarHeader>

    <div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <CalendarGrid v-for="month in grid" :key="month.value.toString()">
        <CalendarGridHead>
          <CalendarGridRow>
            <CalendarHeadCell v-for="day in weekDays" :key="day">
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`" class="mt-2 w-full">
            <CalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate">
              <CalendarCellTrigger :day="weekDate" :month="month.value" />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarPrimitive>
</template>
