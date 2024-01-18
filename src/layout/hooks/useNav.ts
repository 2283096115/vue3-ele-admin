import { emitter } from "@/utils/mitt";
import { computed, CSSProperties } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStoreHook } from "@/store/modules/user";

const errorInfo = "当前路由配置不正确，请检查配置";

export function useNav() {
  const route = useRoute();
  const routers = useRouter().options.routes;

  const getDivStyle = computed((): CSSProperties => {
    return {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      overflow: "hidden"
    };
  });

  /** 用户名 */
  const username = computed(() => {
    return useUserStoreHook()?.username;
  });

  const avatarsStyle = computed(() => {
    return username.value ? { marginRight: "10px" } : "";
  });

  // const { $storage, $config } = useGlobal<GlobalPropertiesApi>();
  // const layout = computed(() => {
  //   return ;
  // });

  const title = computed(() => {
    return "fii";
  });

  /** 退出登录 */
  function logout() {
    useUserStoreHook().logOut();
  }

  function onPanel() {
    emitter.emit("openPanel");
  }

  function handleResize(menuRef) {
    menuRef?.handleResize();
  }

  function resolvePath(route) {
    if (!route.children) return console.error(errorInfo);
    const httpReg = /^http(s?):\/\//;
    const routeChildPath = route.children[0]?.path;
    if (httpReg.test(routeChildPath)) {
      return route.path + "/" + routeChildPath;
    } else {
      return routeChildPath;
    }
  }

  return {
    route,
    title,
    // layout,
    logout,
    routers,
    // $storage,
    onPanel,
    getDivStyle,
    handleResize,
    resolvePath,
    username,
    avatarsStyle
  };
}
