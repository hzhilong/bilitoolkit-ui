import { ConfigEnv, defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath, URL } from 'node:url'
import { bundleStats } from 'rollup-plugin-bundle-stats'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'node:path'

export default defineConfig(({ mode }: ConfigEnv) => {
  return {
    base: './',
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      // 生成 .d.ts 类型文件
      dts({
        // 指定 tsconfig.json 的路径
        tsconfigPath: 'tsconfig.web.json',
        // 输出目录
        outDir: 'dist',
        // 入口文件的根路径
        entryRoot: 'src',
      }),
      // 分析打包体积
      bundleStats({
        baseline: false,
        html: mode !== 'production',
      }),
      viteStaticCopy({
        targets: [
          {
            src: 'src/assets/scss/abstracts/*',
            dest: 'styles/',
          },
        ],
      }),
    ],
    resolve: {
      // 路径别名
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      // 代码混淆和压缩
      minify: true,
      lib: {
        // 库的入口文件
        entry: {
          index: path.resolve(__dirname, 'src/index.ts'),
          common: path.resolve(__dirname, 'src/common.ts'),
        },
        // 库的名称，会作为全局变量名使用
        name: 'bilitoolkit-ui',
        formats: ['es', 'cjs'],
        // 输出文件名
        fileName: (format, entryName) => {
          if (format === 'es') {
            return `${entryName}.js`
          }
          return `${entryName}.umd.cjs`
        },
      },
      sourcemap: true,
      rollupOptions: {
        // 不想打包进库的依赖
        external: [
          'vue',
          '@ybgnb/utils',
          '@ybgnb/bili-api',
          'bilitoolkit-api-types',
          'pinia',
          'element-plus',
          /^element-plus\/.*/,
          'lodash-es',
          /^lodash-es\/.*/,
        ],
        output: {
          // 保持目录结构
          preserveModules: false,
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: 'Vue',
            '@ybgnb/utils': '@ybgnb/utils',
            '@ybgnb/bili-api': '@ybgnb/bili-api',
            'bilitoolkit-api-types': 'bilitoolkit-api-types',
            pinia: 'pinia',
            'element-plus': 'ElementPlus',
            'lodash-es': 'lodash-es',
          },
        },
      },
    },
  }
})
