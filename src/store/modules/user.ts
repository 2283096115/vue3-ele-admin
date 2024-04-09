import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
// import { router } from "@/router";
import { getLogin, refreshTokenApi } from "@/api/user";
import { UserResult, RefreshTokenResult } from "@/api/user";
import { setToken, removeToken, sessionKey } from "@/utils/auth";

const userInfo: userType = JSON.parse(localStorage.getItem(sessionKey));

export const useUserStore = defineStore({
  id: "fii-user",
  state: (): userType => ({
    // 用户名
    username: userInfo?.username ?? "",
    // 页面级别权限
    roles: userInfo?.roles ?? []
  }),
  actions: {
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then(data => {
            if (data) {
              setToken(data.data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      removeToken();
      // resetRouter();
      // router.push("/login");
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then(data => {
            if (data) {
              setToken(data.data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
