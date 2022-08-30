import { axiosApi as axios } from '@nara.platform/accent';
import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { LoaderService } from '../components/Loader/present/logic/LoaderService';

interface ConfigModel {
  noAuth?: boolean;
  noCatch?: boolean;
}

export class AxiosApi {
  //
  static instance: AxiosApi;

  get<T = any>(url: string, config: AxiosRequestConfig & ConfigModel = {}): AxiosPromise<T> {
    //

    return axios
      .get<T>(url, config)
      .then((response) => response)
      .catch((e) => {
        axiosError(e);
        throw e;
      });
  }

  getLoader<T = any>(url: string, config: AxiosRequestConfig & ConfigModel = {}): AxiosPromise<T> {
    //
    LoaderService.instance.openLoader();

    return axios
      .get<T>(url, config)
      .then((response) => {
        LoaderService.instance.closeLoader();
        return response;
      })
      .catch((e) => {
        axiosError(e);
        LoaderService.instance.closeLoader(true);
        throw e;
      });
  }

  delete(url: string, config: AxiosRequestConfig & ConfigModel = {}): AxiosPromise {
    //
    return axios
      .delete(url, config)
      .then((response) => response)
      .catch((e) => {
        axiosError(e);
        throw e;
      });
  }

  deleteLoader(url: string, config: AxiosRequestConfig & ConfigModel = {}): AxiosPromise {
    //
    LoaderService.instance.openPageLoader();

    return axios
      .delete(url, config)
      .then((response) => {
        LoaderService.instance.closeLoader();
        return response;
      })
      .catch((e) => {
        axiosError(e);
        LoaderService.instance.closeLoader(true);
        throw e;
      });
  }

  post<T = any>(url: string, data?: any, config: AxiosRequestConfig & ConfigModel = {}): AxiosPromise<T> {
    //
    return axios
      .post<T>(url, data, config)
      .then((response) => response)
      .catch((e) => {
        axiosError(e);
        throw e;
      });
  }

  postLoader<T = any>(url: string, data?: any, config: AxiosRequestConfig & ConfigModel = {}): AxiosPromise<T> {
    //
    LoaderService.instance.openPageLoader();

    return axios
      .post<T>(url, data, config)
      .then((response) => {
        LoaderService.instance.closeLoader();
        return response;
      })
      .catch((e) => {
        axiosError(e);
        LoaderService.instance.closeLoader(true);
        throw e;
      });
  }

  put<T = any>(url: string, data?: any, config: AxiosRequestConfig & ConfigModel = {}): AxiosPromise<T> {
    //
    return axios
      .put<T>(url, data, config)
      .then((response) => response)
      .catch((e) => {
        axiosError(e);
        throw e;
      });
  }

  putLoader<T = any>(url: string, data?: any, config: AxiosRequestConfig & ConfigModel = {}): AxiosPromise<T> {
    //
    LoaderService.instance.openPageLoader();

    return axios
      .put<T>(url, data, config)
      .then((response) => {
        LoaderService.instance.closeLoader();
        return response;
      })
      .catch((e) => {
        axiosError(e);
        LoaderService.instance.closeLoader(true);
        throw e;
      });
  }

  patch<T = any>(url: string, data?: any, config: AxiosRequestConfig & ConfigModel = {}): AxiosPromise<T> {
    //
    return axios
      .patch<T>(url, data, config)
      .then((response) => response)
      .catch((e) => {
        axiosError(e);
        throw e;
      });
  }

  patchLoader<T = any>(url: string, data?: any, config: AxiosRequestConfig & ConfigModel = {}): AxiosPromise<T> {
    //
    LoaderService.instance.openLoader();

    return axios
      .patch<T>(url, data, config)
      .then((response) => {
        LoaderService.instance.closeLoader();
        return response;
      })
      .catch((e) => {
        axiosError(e);
        LoaderService.instance.closeLoader(true);
        throw e;
      });
  }
}

function axiosError(error: AxiosError) {
  //
  // alert(AlertModel.getErrorAxios());
  console.info(error.response);
}

export function getAxiosErrorXMessage(error: AxiosError): string {
  //
  return error.response?.headers['x-message-code'] || '';
}

Object.defineProperty(AxiosApi, 'instance', {
  value: new AxiosApi(),
  writable: false,
  configurable: false,
});

const axiosApi = AxiosApi.instance;
export { axiosApi };

export function paramsSerializer(paramObj: Record<string, any>) {
  const params = new URLSearchParams();
  for (const key in paramObj) {
    if (paramObj[key] !== undefined) {
      params.append(key, paramObj[key]);
    }
  }
  return params.toString();
}
