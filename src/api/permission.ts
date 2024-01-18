import { http } from "@/utils/http";
const permData = {
  status: "200",
  msg: "success",
  context: {
    buttonAuthority: ["table:add"],
    routerList: ["PlanTable", "PlanTableIndex"]
  }
};

type ApiResult = {
  status: number | string;
  context: any;
  code: number;
  data: any;
  message: string;
};

// 用户权限
export const getCurrentUserPermission = () => {
  return Promise.resolve(permData);
  // return http.request<ApiResult>("get", "/mom/role/getCurrentUserPermissions", {
  //   baseURL: "/codeless"
  // });
};

export const getUserPermission = (data: object) => {
  return http.request<ApiResult>("get", "/mom/role/getUserPermissions", {
    params: data,
    baseURL: "/codeless"
  });
};
