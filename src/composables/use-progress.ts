import { ref } from 'vue'

// 单例状态
const progress = ref(0)
const failed = ref(false)

let trickleTimer: ReturnType<typeof setInterval> | null = null
let startTime = 0
let active = false // 标记是否已 start，防止 finish 误触发

function clearTrickle() {
  if (trickleTimer) {
    clearInterval(trickleTimer)
    trickleTimer = null
  }
}

function beginTrickle() {
  clearTrickle()
  trickleTimer = setInterval(() => {
    if (progress.value < 95) {
      // 越接近 95% 增量越小，模拟真实加载
      progress.value += Math.random() * (95 - progress.value) * 0.1
    }
  }, 200)
}

function start() {
  clearTrickle()
  failed.value = false
  progress.value = 30
  startTime = Date.now()
  active = true
  beginTrickle()
}

function finish() {
  // 未 start 时不执行，避免同路径导航误触发
  if (!active) return
  clearTrickle()
  active = false

  // 防闪烁：至少展示 300ms
  const elapsed = Date.now() - startTime
  const delay = Math.max(0, 300 - elapsed)

  setTimeout(() => {
    progress.value = 100

    setTimeout(() => {
      progress.value = 0
      failed.value = false
    }, 300)
  }, delay)
}

function fail() {
  failed.value = true
  finish()
}

export function useProgress() {
  return { progress, failed, start, finish, fail }
}
