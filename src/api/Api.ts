import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { Config } from '@/constants/config';

export interface AxiosRequestOptions<D> extends AxiosRequestConfig<D> {
  excludeAuthentication?: boolean;
}

export async function apiRequest<D = object, R = unknown>({
  url,
  method,
  data,
  headers,
  params,
}: AxiosRequestOptions<D>) {
  return await Axios.request<D, AxiosResponse<R>>({
    url: `${Config.apiUrl}/${url}`,
    method,
    data,
    headers,
    params,
  });
}
