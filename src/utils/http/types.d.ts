import Axios, {
  Method,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig
} from "axios";

export type resultType = {
  accessToken?: string;
};

export type RequestMethods = Extract<
  Method,
  "get" | "post" | "put" | "delete" | "patch" | "option" | "head"
>;

export interface FiiHttpError extends AxiosError {
  isCancelRequest?: boolean;
}

export interface FiiHttpResponse extends AxiosResponse {
  config: FiiHttpRequestConfig;
}

export interface FiiHttpRequestConfig extends AxiosRequestConfig {
  beforeRequestCallback?: (request: FiiHttpRequestConfig) => void;
  beforeResponseCallback?: (response: FiiHttpResponse) => void;
}

export default class FiiHttp {
  request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: FiiHttpRequestConfig
  ): Promise<T>;
  post<T, P>(
    url: string,
    params?: T,
    config?: FiiHttpRequestConfig
  ): Promise<P>;
  get<T, P>(url: string, params?: T, config?: FiiHttpRequestConfig): Promise<P>;
}
