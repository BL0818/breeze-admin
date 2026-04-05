/**
 * 颜色工具函数
 * 将 hex 颜色转为 shadcn CSS 变量所需的 HSL 格式
 */

/**
 * hex → HSL 字符串（如 "221.2 83.2% 53.3%"）
 * 匹配 shadcn CSS 变量格式：`hsl(var(--primary))` 中的 `var()` 部分
 */
export function hexToHsl(hex: string): string {
  const { h, s, l } = hexToHslObject(hex)
  return `${round(h)} ${round(s)}% ${round(l)}%`
}

/**
 * hex → { h, s, l } 数字对象
 */
export function hexToHslObject(hex: string): { h: number; s: number; l: number } {
  const rgb = hexToRgb(hex)
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const lightness = (max + min) / 2

  if (max === min) {
    return { h: 0, s: 0, l: lightness * 100 }
  }

  const d = max - min
  const saturation = lightness > 0.5 ? d / (2 - max - min) : d / (max + min)

  let hue: number
  switch (max) {
    case r:
      hue = ((g - b) / d + (g < b ? 6 : 0)) / 6
      break
    case g:
      hue = ((b - r) / d + 2) / 6
      break
    default:
      hue = ((r - g) / d + 4) / 6
      break
  }

  return { h: hue * 360, s: saturation * 100, l: lightness * 100 }
}

/**
 * 信息色 = 主色饱和度不变，亮度 +15%（上限 80%）
 * 返回 HSL 字符串格式
 */
export function computeInfoColor(primaryHex: string): string {
  const { h, s, l } = hexToHslObject(primaryHex)
  const newL = Math.min(l + 15, 80)
  return `${round(h)} ${round(s)}% ${round(newL)}%`
}

/**
 * 根据背景色亮度计算最佳前景色 HSL 字符串。
 * 亮度 > 50% → 深色前景；否则 → 浅色前景。
 */
export function computeForeground(hex: string): string {
  const { l } = hexToHslObject(hex)
  return l > 50 ? '222.2 84% 4.9%' : '210 40% 98%'
}

// ---- internal ----

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace('#', '')
  const num = parseInt(cleaned, 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

function round(n: number): number {
  return Math.round(n * 10) / 10
}
