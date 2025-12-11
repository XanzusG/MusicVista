import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '')
  const isProd = env.BUILD_MODE === 'prod'

  return {
    plugins: [
      react({
        // React optimization config
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

    // Build optimization
    build: {
      // Target browsers
      target: 'es2015',
      
      // Output directory
      outDir: 'dist',
      
      // Assets directory
      assetsDir: 'assets',
      
      // Chunk size warning limit (KB)
      chunkSizeWarningLimit: 1000,
      
      // Minification
      minify: isProd ? 'esbuild' : false,
      
      // Source Map
      sourcemap: !isProd,
      
      // CSS code splitting
      cssCodeSplit: true,
      
      // Rollup options
      rollupOptions: {
        output: {
          // Manual chunk strategy
          manualChunks: {
            // React related
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            
            // UI component library
            'ui-vendor': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toast',
              '@radix-ui/react-tooltip'
            ],
            
            // Chart libraries
            'chart-vendor': ['chart.js', 'react-chartjs-2', 'recharts'],
            
            // Utility libraries
            'util-vendor': [
              'date-fns',
              'clsx',
              'tailwind-merge',
              'zod',
              'lucide-react'
            ],
            
            // Music related (internal modules)
            // 'music-vendor': ['lyrics-api', 'like-api', 'useApi']
          },
          
          // File name format
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
      
      // Compression options
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
      
      // Report compressed size
      reportCompressedSize: isProd,
      
      // Clean dist directory
      emptyOutDir: true,
    },

    // Server configuration
    server: {
      port: 5173,
      host: true,
      open: true,
      
      // Dev server optimization
      hmr: {
        overlay: false,
      },
      
      // Proxy configuration - use server service (port 3001)
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'), // Keep /api path
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

    // Preview configuration
    preview: {
      port: 4173,
      host: true,
      open: false,
    },

    // Dependency optimization
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
      
      // Pre-build optimization
      esbuildOptions: {
        target: 'es2015',
      }
    },

    // CSS configuration
    css: {
      // CSS preprocessor config
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`
        }
      },
      
      // CSS code splitting
      codeSplit: true,
      
      // Extract CSS
      extract: isProd,
      
      // PostCSS configuration
      postcss: './postcss.config.js'
    },

    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __DEV__: !isProd,
    },

    // Experimental features
    experimental: {
      renderBuiltUrl(filename, { hostType }) {
        if (hostType === 'js') {
          return { runtime: `window.__assetsPath(${JSON.stringify(filename)})` }
        } else {
          return { relative: true }
        }
      }
    },

    // Environment variable prefix
    envPrefix: 'VITE_',

    // Worker configuration
    worker: {
      format: 'es',
    },
  }
})

