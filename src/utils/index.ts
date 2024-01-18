import { useUserInfoHook } from "@/store/modules/permission";
const userStore = useUserInfoHook();

/**
 * 下载文件 导出文件流可参考 接口exportOrderApi
 * @param {string} url
 */
export function downloadFile(url: string) {
  // location.href = url;
  // window.open(url)
  // console.log(title);
  console.log(url);
  const ele = document.createElement("a");
  ele.download = url;
  ele.style.display = "none";
  ele.href = url;
  ele.target = "_blank"; // 针对 ie模式 的浏览器
  // 触发点击
  document.body.appendChild(ele);
  ele.click();
  // 然后移除
  document.body.removeChild(ele);
}

/**
 * @description  校验按钮权限
 * @param        {String} btnName 按钮权限名称
 * @return       {Boolean}
 */
export function checkPermission(btnName: String) {
  const btnPermissionList = userStore.btnPermission;
  if (btnPermissionList.includes(btnName)) {
    return true;
  } else {
    return false;
  }
}

//深拷贝
export function deepClone(target) {
  // 判断是否是对象
  if (typeof target === "object") {
    // 兼容数组与对象
    const obj = Array.isArray(target) ? [] : {};
    for (const key in target) {
      obj[key] = deepClone(target[key]);
    }
    return obj;
  } else {
    return target;
  }
}
