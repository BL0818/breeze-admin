import { ref } from 'vue'
import { toast } from 'vue-sonner'
import * as XLSX from 'xlsx'

export interface ExportColumn {
  key: string
  header: string
}

export function useExportExcel<T extends Record<string, any>>() {
  const isExporting = ref(false)

  const exportToExcel = async (
    data: T[],
    columns: ExportColumn[],
    filename: string,
    options?: {
      exportSuccessText?: string
      exportFailedText?: string
    }
  ) => {
    if (isExporting.value) return

    isExporting.value = true

    try {
      // 模拟导出过程（1-2秒）
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 构建工作表数据
      const sheetData = data.map(row =>
        columns.map(col => {
          const value = row[col.key]
          return value ?? ''
        })
      )

      // 添加表头
      sheetData.unshift(columns.map(col => col.header))

      // 创建工作簿和工作表
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

      // 生成 Excel 文件并下载
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)

      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`)
      link.style.visibility = 'hidden'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)

      toast.success(options?.exportSuccessText || 'Export successful', {
        description: `${filename}.xlsx`
      })
    } catch (error) {
      toast.error(options?.exportFailedText || 'Export failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      isExporting.value = false
    }
  }

  return {
    isExporting,
    exportToExcel
  }
}
