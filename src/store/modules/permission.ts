import { defineStore } from "pinia";
import { store } from "@/store";
import { getCurrentUserPermission } from "@/api/permission";
import { permissionRoutes } from "@/router/modules/home";
// import router from "@/router";

const useUserInfo = defineStore({
  id: "fii-permission",
  state: (): {
    routerPermission: any[];
    btnPermission: any[];
    routes: RouteConfigsTable[];
    userInfo: {};
  } => ({
    routerPermission: [],
    btnPermission: [],
    routes: [],
    userInfo: {}
  }),
  actions: {
    GET_USER_INFO() {
      return new Promise((resolve, reject) => {
        function filterRouter(list: Array<any>, permissionList: Array<any>) {
          const filterRouterList = [];
          for (let index = 0; index < list.length; index++) {
            const item = list[index];
            if (permissionList.includes(item.name)) {
              if (item?.children?.length > 0) {
                item.children = filterRouter(item.children, permissionList);
              }
              filterRouterList.push(item);
            }
          }
          return filterRouterList;
        }
        getCurrentUserPermission().then(res => {
          if (res.status === "200") {
            const { buttonAuthority, routerList } = res.context;
            this.routerPermission = routerList || [];
            this.btnPermission = buttonAuthority || [];
            const permissionList = routerList
              .filter(item => item.indexOf("Plan") === 0)
              .map(item => item.substring(4));
            this.routes = filterRouter(permissionRoutes, permissionList) || [];
            // this.routes = permissionRoutes || [];
            resolve(this);
          }
          reject();
        });
      });
    }
  }
});
export function useUserInfoHook() {
  return useUserInfo(store);
}
