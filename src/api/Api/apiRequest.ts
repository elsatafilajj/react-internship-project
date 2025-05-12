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
  excludeAuthentication = false,
}: AxiosRequestOptions<D>) {
  const token = localStorage.getItem('token');

  if (!Config.apiUrl) {
    throw new Error('API base URL (VITE_API_URL) is not defined');
  }

  const axiosConfig: AxiosRequestConfig<D> = {
    url: `${Config.apiUrl}/${url}`,
    method,
    data,
    headers: { ...(headers || {}) },
    params,
  };

  if (token && !excludeAuthentication) {
    axiosConfig.headers!['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response: AxiosResponse<R> = await Axios.request<D, AxiosResponse<R>>(
      axiosConfig,
    );
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
