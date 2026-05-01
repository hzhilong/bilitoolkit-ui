import { ConfigEnv, defineConfig, UserConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath, URL } from 'node:url'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'node:path'

export default defineConfig(({ mode: _mode }: ConfigEnv) => {
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
  const _global = external
    .filter((name) => !(name instanceof RegExp))
    .reduce(
      (acc, name) => {
        if (typeof name === 'string') {
          acc[name] = name
        }
        return acc
      },
      {} as Record<string, string>,
    )
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
        tsconfigPath: 'tsconfig.web.json',
        outDir: 'dist',
        entryRoot: 'src',
        rollupTypes: false,
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
        formats: ['es'],
        fileName: (format, entryName) => {
          if (format === 'es') {
            return `${entryName}.js`
          }
          return `${entryName}.umd.cjs`
        },
      },
      sourcemap: true,
      rolldownOptions: {
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
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          //          globals: global,
        },
      },
    },
  } satisfies UserConfig
})
