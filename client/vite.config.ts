import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  const isProd = env.BUILD_MODE === 'prod'

  return {
    plugins: [
      react({
        // React 优化配置
        babel: {
          plugins: isProd ? [
            ['transform-remove-console', { exclude: ['error', 'warn'] }]
          ] : []
        }
      }),
    ],
    
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@types": path.resolve(__dirname, "./src/types"),
        "@data": path.resolve(__dirname, "./src/data"),
        "@contexts": path.resolve(__dirname, "./src/contexts"),
      },
    },

    // 构建优化
    build: {
      // 目标浏览器
      target: 'es2015',
      
      // 输出目录
      outDir: 'dist',
      
      // 资源目录
      assetsDir: 'assets',
      
      // 块大小警告限制 (KB)
      chunkSizeWarningLimit: 1000,
      
      // 最小化
      minify: isProd ? 'esbuild' : false,
      
      // Source Map
      sourcemap: !isProd,
      
      // CSS 代码分割
      cssCodeSplit: true,
      
      // Rollup 选项
      rollupOptions: {
        output: {
          // 手动分块策略
          manualChunks: {
            // React 相关
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            
            // UI 组件库
            'ui-vendor': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toast',
              '@radix-ui/react-tooltip'
            ],
            
            // 图表库
            'chart-vendor': ['chart.js', 'react-chartjs-2', 'recharts'],
            
            // 工具库
            'util-vendor': [
              'date-fns',
              'clsx',
              'tailwind-merge',
              'zod',
              'lucide-react'
            ],
            
            // 音乐相关（内部模块）
            // 'music-vendor': ['lyrics-api', 'like-api', 'useApi']
          },
          
          // 文件名格式
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? 
              chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '') : 
              'chunk';
            return `js/${facadeModuleId}-[hash].js`;
          },
          
          assetFileNames: (assetInfo) => {
            const assetName = assetInfo.name || 'asset';
            
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetName)) {
              return `images/[name]-[hash][extname]`;
            }
            
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetName)) {
              return `fonts/[name]-[hash][extname]`;
            }
            
            return `assets/[name]-[hash][extname]`;
          }
        }
      },
      
      // 压缩选项
      terserOptions: isProd ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info'],
        },
        mangle: {
          safari10: true,
        },
        format: {
          comments: false,
        },
      } : undefined,
      
      // 报告压缩大小
      reportCompressedSize: isProd,
      
      // 清理 dist 目录
      emptyOutDir: true,
    },

    // 服务器配置
    server: {
      port: 5173,
      host: true,
      open: true,
      
      // 开发服务器优化
      hmr: {
        overlay: false,
      },
      
      // 代理配置 - 统一使用server服务 (端口3001)
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'), // 保持/api路径
        },
        '/auth': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/auth/, '/api/auth'),
        },
        '/users': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/users/, '/api/users'),
        },
        '/likes': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/likes/, '/api/likes'),
        },
        '/lyrics': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/lyrics/, '/api/lyrics'),
        },
        '/social': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/social/, '/api/social'),
        }
      }
    },

    // 预览配置
    preview: {
      port: 4173,
      host: true,
      open: false,
    },

    // 依赖优化
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        'lucide-react',
        'clsx',
        'tailwind-merge'
      ],
      
      // 预构建优化
      esbuildOptions: {
        target: 'es2015',
      }
    },

    // CSS 配置
    css: {
      // CSS 预处理器配置
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`
        }
      },
      
      // CSS 代码分割
      codeSplit: true,
      
      // 提取 CSS
      extract: isProd,
      
      // PostCSS 配置
      postcss: './postcss.config.js'
    },

    // 定义全局常量
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __DEV__: !isProd,
    },

    // 实验性功能
    experimental: {
      renderBuiltUrl(filename, { hostType }) {
        if (hostType === 'js') {
          return { runtime: `window.__assetsPath(${JSON.stringify(filename)})` }
        } else {
          return { relative: true }
        }
      }
    },

    // 环境变量前缀
    envPrefix: 'VITE_',

    // Worker 配置
    worker: {
      format: 'es',
    },
  }
})

