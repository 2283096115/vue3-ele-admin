import dayjs from "dayjs";
import { resolve } from "path";
import { Alias, ConfigEnv, UserConfig, defineConfig, loadEnv } from "vite";
import { warpperEnv } from "./build";
import { exclude, include } from "./build/optimize";
import { getPluginsList } from "./build/plugins";
import pkg from "./package.json";

/** 当前执行node命令时文件夹的地址（工作目录） */
const root: string = process.cwd();

/** 路径查找 */
const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir);
};

/** 设置别名 */
const curAlias: Array<Alias> = [
  { find: "@", replacement: pathResolve("src") },
  { find: "@build", replacement: pathResolve("build") }
];
const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
};

export default defineConfig(
  async ({ mode }: ConfigEnv): Promise<UserConfig> => {
    const { VITE_PORT, VITE_PUBLIC_PATH, VITE_COMPRESSION } = warpperEnv(
      loadEnv(mode, root)
    );
    const config = {
      base: VITE_PUBLIC_PATH,
      root,
      resolve: {
        alias: curAlias
      },
      // 服务端渲染
      server: {
        // 是否开启 https
        https: false,
        // 端口号
        port: VITE_PORT,
        host: "0.0.0.0",
        // 本地跨域代理 https://cn.vitejs.dev/config/server-options.html#server-proxy
        proxy: {
          "/api": {
            // target: "http://106.52.79.104:8018/",
            // target: "http://www.armtu.com:33390/",
            target: "http://43.138.208.115:8018/",
            changeOrigin: true,
            rewrite: path => path.replace(/^\/api/, "")
          }
        }
      },
      plugins: getPluginsList(VITE_COMPRESSION),
      // https://cn.vitejs.dev/config/dep-optimization-options.html#dep-optimization-options
      optimizeDeps: {
        include,
        exclude
      },
      build: {
        sourcemap: false,
        // 消除打包大小超过500kb警告
        chunkSizeWarningLimit: 4000,
        rollupOptions: {
          input: {
            index: pathResolve("index.html")
          },
          // 静态资源分类打包
          output: {
            chunkFileNames: "static/js/[name]-[hash].js",
            entryFileNames: "static/js/[name]-[hash].js",
            assetFileNames: "static/[ext]/[name]-[hash].[ext]"
          }
        },
        outDir: "dist"
      },
      define: {
        __APP_INFO__: JSON.stringify(__APP_INFO__)
      }
    };
    return config;
  }
);
