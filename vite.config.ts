import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const plugins = [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-imports.d.ts',
      resolvers: [
        (name: string) => {
          if (name.startsWith('Lucide')) {
            return { name, as: name, from: 'lucide-vue-next' }
          }
        }
      ]
    }),
    Components({
      dts: 'src/components.d.ts',
      resolvers: [
        (name: string) => {
          const componentNames = [
            'Button', 'Card', 'CardContent', 'CardHeader', 'CardTitle',
            'Input', 'Label', 'DropdownMenu', 'DropdownMenuContent',
            'DropdownMenuItem', 'DropdownMenuSeparator', 'DropdownMenuTrigger',
            'Avatar', 'AvatarFallback', 'Badge', 'Table', 'TableBody',
            'TableCell', 'TableHead', 'TableHeader', 'TableRow',
            'Tabs', 'TabsContent', 'TabsList', 'TabsTrigger',
            'Sheet', 'SheetContent', 'Skeleton', 'Separator',
            'Breadcrumb', 'BreadcrumbList', 'BreadcrumbItem',
            'BreadcrumbLink', 'BreadcrumbPage', 'BreadcrumbSeparator',
            'Form', 'FormControl', 'FormDescription', 'FormField', 'FormItem', 'FormLabel', 'FormMessage',
            'Alert', 'AlertDescription', 'AlertTitle'
          ]
          if (componentNames.includes(name)) {
            return { name, from: '@/components/ui' }
          }
        }
      ]
    })
  ]

  // 仅在 analyze 模式下启用 visualizer
  if (env.VITE_ANALYZE === 'true') {
    plugins.push(
      visualizer({
        filename: 'stats.html',
        open: true,
        gzipSize: true
      })
    )
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      host: true,
      port: 2018
    },
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'echarts',
        'reka-ui',
        'lucide-vue-next',
        '@vueuse/core',
        'vorms',
        'zod'
      ]
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      }
    }
  }
})
