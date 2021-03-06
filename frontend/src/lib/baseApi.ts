/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from 'axios';

import { ErrorResponse } from 'types/api';
import tokenUtils from 'utils/tokenUtils';

export const API_VERSION = 'v1';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_API}`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = tokenUtils.getToken();

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error));
  },
);

export { api };

export default class BaseApi {
  protected async get<RES>(
    url: string,
    handler: (res: RES) => any,
  ): Promise<any> {
    return this.requestWrapper(
      async () => await api.get<never, AxiosResponse<RES | ErrorResponse>>(url),
      handler,
    );
  }

  protected async post<REQ, RES>(
    url: string,
    body: REQ,
    handler: (res: RES) => any,
  ): Promise<any> {
    return this.requestWrapper(
      async () =>
        await api.post<REQ, AxiosResponse<RES | ErrorResponse>>(url, body),
      handler,
    );
  }

  protected async put<REQ, RES>(
    url: string,
    body: REQ,
    handler: (res: RES) => any,
  ): Promise<any> {
    return this.requestWrapper(
      async () =>
        await api.put<REQ, AxiosResponse<RES | ErrorResponse>>(url, body),
      handler,
    );
  }

  protected async delete<RES>(
    url: string,
    handler: (res: RES) => any,
  ): Promise<any> {
    return this.requestWrapper(
      async () =>
        await api.delete<never, AxiosResponse<RES | ErrorResponse>>(url),
      handler,
    );
  }

  private async requestWrapper<RES>(
    apiRequest: () => Promise<AxiosResponse<RES | ErrorResponse>>,
    handler: (res: RES) => any,
  ): Promise<any> {
    try {
      const response = await apiRequest();
      if (response.status === 200) {
        const data = response.data as RES;
        return handler(data);
      }
      if ('error' in response.data) {
        throw new Error(response.data.error);
      }
      throw new Error('Something went wrong!');
    } catch (error: any) {
      if (error.response) {
        return Promise.reject(new Error(error.response.data.error));
      }
      return await Promise.reject(error);
    }
  }
}
