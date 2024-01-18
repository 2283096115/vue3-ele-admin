// vue.config.js
import Icons from "unplugin-icons/vite";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export const icon = [
  Components({
    resolvers: [
      IconsResolver({
        prefix: "icon",
        alias: {
          system: "system-uicons"
        },
        extension: "svg",
        customCollections: ["svg"]
      }),
      ElementPlusResolver({ importStyle: false })
    ],
    // 避免在开发环境的时候总是生成不完整的 d.ts文件，build的时候才能生成完整的
    dts:
      process.env.NODE_ENV === "production" ? "./types/components.d.ts" : false
  }),
  Icons({
    compiler: "vue3",
    autoInstall: true,
    customCollections: {
      svg: FileSystemIconLoader("src/assets/svg", svg =>
        svg.split(/fill=".*?"/).join('fill="currentColor" ')
      )
    }
  })
];
