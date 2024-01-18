// import { cdn } from "./cdn";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { viteBuildInfo } from "./info";
import { icon } from "./icon";
import svgLoader from "vite-svg-loader";
import vueJsx from "@vitejs/plugin-vue-jsx";
import removeConsole from "vite-plugin-remove-console";
import { configCompressPlugin } from "./compress";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { PluginOption } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export function getPluginsList(
  VITE_COMPRESSION: ViteCompression
): PluginOption[] {
  // npm 提供一个 npm_lifecycle_event 变量，返回当前正在运行的脚本名称，比如 pretest 、 test 、 posttest 等等。
  // pnpm report 生成打包报表
  const lifecycle = process.env.npm_lifecycle_event;
  const plugins = [
    ...icon,
    AutoImport({
      imports: ["vue", "vue-router"],
      resolvers: [ElementPlusResolver({ importStyle: false })],
      dts: "./types/auto-imports.d.ts"
      // 可以选择auto-import.d.ts生成的位置，使用ts建议设置为'src/auto-import.d.ts'
      // dts: 'src/auto-import.d.ts'
    }),
    vue(),
    VueI18nPlugin({
      runtimeOnly: true,
      compositionOnly: true,
      include: [resolve("locales/**")]
    }),
    // jsx、tsx语法支持
    vueJsx(),
    // 打包压缩优化 需要ng 或者后端配合 https://juejin.cn/post/6966507461872189454
    configCompressPlugin(VITE_COMPRESSION),
    // 线上环境删除console
    removeConsole({ external: ["src/assets/iconfont/iconfont.js"] }),
    viteBuildInfo(),
    // svg组件化支持
    svgLoader(),
    // 打包分析
    lifecycle === "report"
      ? visualizer({ open: true, brotliSize: true, filename: "report.html" })
      : null
  ];
  return plugins;
}
