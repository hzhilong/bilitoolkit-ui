import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'node:path'

const external = [
  'vue',
  '@vue/language-core',
  '@ybgnb/utils',
  '@ybgnb/bili-api',
  'bilitoolkit-types',
  'bilitoolkit-runtime',
  'pinia',
  'element-plus',
  /^element-plus\/.*/,
  'lodash-es',
  /^lodash-es\/.*/,
]

export default defineConfig((configEnv) => ({
  base: './',
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      dts: 'src/auto-imports.d.ts',
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      dts: 'src/components.d.ts',
      resolvers: [ElementPlusResolver()],
    }),
    // 生成 .d.ts 类型文件
    dts({
      tsconfigPath: 'tsconfig.web.json',
      outDir: 'dist',
      entryRoot: 'src',
      rollupTypes: configEnv.mode === 'development',
    }),
    // 分析打包体积
    //      bundleStats({
    //        baseline: false,
    //        html: mode !== 'production',
    //      }),
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
      '@': path.join(import.meta.dirname, 'src'),
    },
  },
  build: {
    // 代码混淆和压缩
    minify: false,
    lib: {
      // 库的入口文件
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        common: path.resolve(__dirname, 'src/common.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => {
        if (format === 'es') {
          return `${entryName}.js`
        }
        return `${entryName}.cjs`
      },
    },
    sourcemap: true,
    rollupOptions: {
      // 不想打包进库的依赖
      external: external,
      output: {
        // 不保留目录结构
        preserveModules: false,
        /*           entryFileNames: (chunkInfo) => {
            // 把带有 ? 的非法路径重命名
            // 例如：level_1.svg?url -> level_1.svg_url.js
            // 仅 preserveModules=true并且为库模式时才开启
            // 可用来开发模式下查看哪个文件打包产物过大
            return chunkInfo.name.replace(/\?/, '_') + '.js'
          }, */
      },
    },
  },
}))
