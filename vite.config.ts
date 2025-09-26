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
      dts({
        // 指定 tsconfig.json 的路径
        tsconfigPath: 'tsconfig.web.json',
        // 输出目录
        outDir: 'dist',
        entryRoot: 'src',
      }),
      // bundle-stats 插件
      bundleStats({
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
      // 设置为 false 可以禁用代码混淆和压缩
      minify: true,
      lib: {
        // 库的入口文件
        entry: 'src/index.ts',
        // 库的名称，会作为全局变量名使用
        name: 'BilitoolkitUi',
        // 输出文件名
        fileName: 'bilitoolkit-ui',
      },
      // 建议为库开启 sourcemap
      sourcemap: false,
      rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        external: ['vue', '@ybgnb/utils', 'bilitoolkit-api-types', 'pinia', 'element-plus', 'lodash-es'],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: 'Vue',
            '@ybgnb/utils': '@ybgnb/utils',
            'bilitoolkit-api-types': 'bilitoolkit-api-types',
            pinia: 'pinia',
            'lodash-es': 'lodash-es',
            'element-plus': 'ElementPlus',
          },
        },
      },
    },
  }
})
