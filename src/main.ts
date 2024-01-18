import App from "./App.vue";
import router from "./router";
import { setupStore } from "@/store";
import { usePluginI18n, mom_$t } from "@/plugins/i18n";
import { createApp, Directive } from "vue";
import { MotionPlugin } from "@vueuse/motion";

// 引入重置样式
import "./style/reset.scss";
// 导入公共样式
import "./style/element/index.scss";
// 导入公共样式
import "./style/index.scss";
// 一定要在main.ts中导入tailwind.css，防止vite每次hmr都会请求src/style/index.scss整体css文件导致热更新慢的问题
import "./style/tailwind.css";
import { ElMessage } from "element-plus";
// element-plus 和公共组件(components目录下的组件)都是自动引入(插件引入)的，不需要手动引入

const app = createApp(App);

// app.use(momUi);

// 自定义指令
import * as directives from "@/directives";
Object.keys(directives).forEach(key => {
  app.directive(key, (directives as { [key: string]: Directive })[key]);
});

// 添加全局属性
window.$message = ElMessage;
window.mom_$t = mom_$t;
app.config.globalProperties.mom_$t = mom_$t;

app.use(router);
setupStore(app);
app.use(MotionPlugin).use(usePluginI18n);
app.mount("#app");
