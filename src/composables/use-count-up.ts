import { ref, watch, type Ref } from 'vue'

/**
 * 数字滚动动画
 * @param source 响应式数值源
 * @param duration 动画时长(ms)，默认 1200
 * @param disabled 是否禁用动画（初始加载时使用）
 */
export function useCountUp(source: Ref<number>, duration = 1200, disabled = ref(false)) {
  const displayValue = ref(0)
  let rafId: number | null = null

  function animate(from: number, to: number) {
    if (disabled.value || from === to) {
      displayValue.value = to
      return
    }

    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo 缓动，数字滚动更自然
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      displayValue.value = from + (to - from) * eased

      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        displayValue.value = to
        rafId = null
      }
    }

    rafId = requestAnimationFrame(tick)
  }

  watch(source, (newVal, oldVal) => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
    }
    animate(oldVal ?? 0, newVal)
  }, { immediate: false })

  // 首次数据到达时触发动画
  const trigger = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
    }
    animate(0, source.value)
  }

  return { displayValue, trigger }
}
