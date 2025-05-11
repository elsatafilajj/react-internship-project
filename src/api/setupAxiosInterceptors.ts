import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

import { apiRequest } from '@/api/Api';
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
  updateTokens: AuthContextType['updateTokens'],
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
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return toast.error('Refresh token is missing');

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((newAccessToken) => {
              if (originalRequest.headers) {
                originalRequest.headers['Authorization'] =
                  `Bearer ${newAccessToken}`;
              }
              return axios(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
          const response = await apiRequest<
            { refreshToken: string },
            {
              accessToken: string;
              refreshToken: string;
            }
          >({
            method: 'POST',
            url: 'auth/refresh-token',
            data: { refreshToken },
          });

          updateTokens({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          });

          const newAccessToken = response.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);

          axios.defaults.headers.common['Authorization'] =
            `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);

          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] =
              `Bearer ${newAccessToken}`;
          }

          return axios(originalRequest);
        } catch (err) {
          processQueue(err as AxiosError, null);
          logout();
          toast.error('Your session has expired. Please sign in again.', {
            id: 'unauthorized',
          });
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
