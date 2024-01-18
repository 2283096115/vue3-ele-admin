import NProgress from "@/utils/progress";
import {
  Router,
  createRouter,
  RouteRecordRaw,
  createWebHashHistory,
  RouterHistory,
  createWebHistory
} from "vue-router";

import { useUserInfoHook } from "@/store/modules/permission";
const userStore = useUserInfoHook();

import { systemRoutes } from "./modules/home";
// import remainingRouter from "./modules/remaining";
// import mainPlan from './modules/mainPlan'
/** 原始静态路由（未做任何处理） */
const routes: Array<RouteConfigsTable> = [...systemRoutes];
const constantRoutes: Array<RouteRecordRaw> = routes as Array<RouteRecordRaw>;

/** 用于渲染菜单，保持原始层级 */
export const constantMenus: Array<RouteConfigsTable> = routes;

/** 获取路由历史模式 https://next.router.vuejs.org/zh/guide/essentials/history-mode.html */
function getHistoryMode(routerHistory): RouterHistory {
  // len为1 代表只有历史模式 为2 代表历史模式中存在base参数 https://next.router.vuejs.org/zh/api/#%E5%8F%82%E6%95%B0-1
  const historyMode = routerHistory.split(",");
  const leftMode = historyMode[0];
  const rightMode = historyMode[1];
  // no param
  if (historyMode.length === 1) {
    if (leftMode === "hash") {
      return createWebHashHistory("");
    } else if (leftMode === "h5") {
      return createWebHistory("");
    }
  } //has param
  else if (historyMode.length === 2) {
    if (leftMode === "hash") {
      return createWebHashHistory(rightMode);
    } else if (leftMode === "h5") {
      return createWebHistory(rightMode);
    }
  }
}

/** 创建路由实例 */
export const router: Router = createRouter({
  history: getHistoryMode(import.meta.env.VITE_ROUTER_HISTORY),
  routes: constantRoutes,
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    return new Promise(resolve => {
      if (savedPosition) {
        return savedPosition;
      } else {
        if (from.meta.saveScrollTop) {
          const top: number =
            document.documentElement.scrollTop || document.body.scrollTop;
          resolve({ left: 0, top });
        }
      }
    });
  }
});

/** 路由白名单 */
const whiteList = ["/error/403", "/error/404", "/error/500"];

router.beforeEach((to: toRouteType, _from, next) => {
  // const userInfo = storageSession().getItem<DataInfo<number>>(sessionKey);
  const routerPermission = userStore.routerPermission;
  to.matched.some(item => {
    if (!item.meta.title) return "";
    document.title = item.meta.title as string;
  });
  NProgress.start();
  /** 如果已经登录并存在登录信息后不能跳转到路由白名单，而是继续保持在当前页面 */
  function toCorrectRoute() {
    // whiteList.includes(to.fullPath) ? next(_from.fullPath) : next();
    next();
    return;
  }
  // 路由由权限控制，若往根路由跳转，需要找到当前用户的有权限的第一个路由地址进行跳转
  function toHasPermissionRoute() {
    next(userStore.routes[0]);
  }
  if (whiteList.includes(to.fullPath)) {
    next();
    return;
  }
  if (routerPermission.length > 0) {
    if (to.path === "/") {
      toHasPermissionRoute();
    }
    toCorrectRoute();
  } else {
    getUserPermission(to, _from, next);
  }
});

router.afterEach(() => {
  NProgress.done();
});

function getUserPermission(to, _from, next) {
  userStore
    .GET_USER_INFO()
    .then(() => {
      const authRoutes = userStore.routes as Array<RouteRecordRaw>;
      // router.addRoute("/", authRoutes);
      for (let index = 0; index < authRoutes.length; index++) {
        const item = authRoutes[index];
        router.addRoute(item);
      }
      if (userStore.routerPermission.length > 0) {
        next(to);
      } else {
        next({ path: "/error/403" });
      }
    })
    .catch(e => {
      console.log(e);
      NProgress.done();
      $message({ type: "error", message: "用户登录失效，请重新登录" });
    });
}

export default router;
