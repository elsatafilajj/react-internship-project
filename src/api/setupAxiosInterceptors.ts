import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

import { refreshTokenApi } from '@/api/User/user.client';
import { AuthContextType } from '@/context/AuthContext/AuthContext';

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

export const setupAxiosInterceptors = (
  logout: AuthContextType['logout'],
  setAuthState: AuthContextType['setAuthState'],
) => {
  const authMiddleware = axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  const responseMiddleware = axios.interceptors.response.use(
    async (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');

          if (!refreshToken) {
            throw new Error('Your session has expired.');
          }

          const response = await refreshTokenApi({ refreshToken });

          setAuthState({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          });

          processQueue(null, response.data.accessToken);

          return axios(originalRequest);
        } catch (err) {
          processQueue(err as AxiosError, null);
          logout();
          toast.error('Your session has expired. Please sign in again.');
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );

  return () => {
    axios.interceptors.request.eject(authMiddleware);
    axios.interceptors.response.eject(responseMiddleware);
  };
};
