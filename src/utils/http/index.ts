import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  FiiHttpError,
  RequestMethods,
  FiiHttpResponse,
  FiiHttpRequestConfig
} from "./types.d";
import { stringify } from "qs";
import { ElLoading } from "element-plus";
import { getToken } from "../auth";

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 10000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: obj => {
      return stringify(obj, { arrayFormat: "repeat" });
    }
  },
  baseURL: "/api"
};

// 全局loading
let loading = null;
function startLoading() {
  loading = ElLoading.service({
    lock: true,
    text: "加载中……",
    background: "rgba(0, 0, 0, 0.7)"
  });
}
function endLoading() {
  loading.close();
}
let needLoadingRequestCount = 0;
function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading();
  }
  needLoadingRequestCount++;
}

function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    endLoading();
  }
}
// 当出现错误超时取消loading
function cancelLoading() {
  setTimeout(() => {
    tryHideFullScreenLoading();
  }, 2000);
}

/**
 * 移除空字符串，null, undefined
 * @param config
 */
export function clearEmptyParam(config) {
  ["data", "params"].forEach(item => {
    if (config[item]) {
      const keys = Object.keys(config[item]);
      if (keys.length) {
        keys.forEach(key => {
          if (["", undefined, null].includes(config[item][key])) {
            // 移除属性之前，进行深拷贝断开引用，避免影响页面
            config[item] = JSON.parse(JSON.stringify(config[item]));
            delete config[item][key];
          }
        });
      }
    }
  });
}
class FiiHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  /** 初始化配置对象 */
  private static initConfig: FiiHttpRequestConfig = {};

  /** 保存当前Axios实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  /** 对外提供方法 */
  public getUri = FiiHttp.axiosInstance.getUri;

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    FiiHttp.axiosInstance.interceptors.request.use(
      async (config: FiiHttpRequestConfig): Promise<any> => {
        showFullScreenLoading();
        clearEmptyParam(config);
        config.headers["Authorization"] = getToken();
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    const instance = FiiHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: FiiHttpResponse) => {
        const $config = response.config;
        tryHideFullScreenLoading();
        // 优先判断post/get等方法是否传入回掉，否则执行初始化设置等回掉
        if (typeof $config.beforeResponseCallback === "function") {
          $config.beforeResponseCallback(response);
          return response.data;
        }
        if (FiiHttp.initConfig.beforeResponseCallback) {
          FiiHttp.initConfig.beforeResponseCallback(response);
          return response.data;
        }
        const { status, message } = response.data;
        if ([100, 200, "200"].includes(status)) {
          return response.data;
        } else {
          $message.error(message);
          return Promise.reject(response.data);
        }
      },
      (error: FiiHttpError) => {
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        cancelLoading();
        $message.error($error);
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error);
      }
    );
  }

  /** 通用请求工具函数 */
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: FiiHttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig
    } as FiiHttpRequestConfig;

    // 单独处理自定义请求/响应回掉
    return new Promise((resolve, reject) => {
      FiiHttp.axiosInstance
        .request(config)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /** 单独抽离的post工具函数 */
  public post<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: FiiHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("post", url, params, config);
  }

  /** 单独抽离的get工具函数 */
  public get<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: FiiHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("get", url, params, config);
  }
}

export const http = new FiiHttp();
