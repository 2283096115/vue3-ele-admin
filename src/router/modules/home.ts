const Layout = () => import("@/layout/index.vue");
import orderIcon from "@/assets/svg/orderIcon.svg";

export const systemRoutes = [
  {
    path: "/",
    name: "Home",
    component: Layout,
    meta: {
      icon: "homeFilled",
      title: "首页",
      showLink: false
    },
    children: []
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
      showLink: false
    }
  },
  {
    path: "/error",
    redirect: "/error/403",
    component: Layout,
    meta: {
      icon: "informationLine",
      title: "异常页面",
      showLink: false
    },
    children: [
      {
        path: "/error/403",
        name: "403",
        component: () => import("@/views/error/403.vue"),
        meta: {
          title: "403"
        }
      },
      {
        path: "/error/404",
        name: "404",
        component: () => import("@/views/error/404.vue"),
        meta: {
          title: "404"
        }
      },
      {
        path: "/error/500",
        name: "500",
        component: () => import("@/views/error/500.vue"),
        meta: {
          title: "500"
        }
      }
    ]
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      title: "加载中...",
      showLink: false
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  }
];
// 一下菜单需要通过权限校验
export const permissionRoutes = [
  {
    path: "/table",
    name: "Table",
    component: Layout,
    redirect: "/table/index",
    meta: {
      icon: orderIcon,
      title: "公共组件"
    },
    children: [
      {
        path: "/table/index",
        name: "TableIndex",
        component: () => import("@/views/table/index.vue"),
        meta: {
          title: "表格"
        }
      }
    ]
  }
] as RouteConfigsTable[];
