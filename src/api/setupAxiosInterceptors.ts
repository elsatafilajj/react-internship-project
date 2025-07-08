import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

import { refreshTokenApi } from '@/api/User/user.client';
import { AuthContextType } from '@/context/AuthContext/AuthContext';
import { updateSocketAuth } from '@/helpers/socket';

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];
let refreshTimer: NodeJS.Timeout | null = null;

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const REFRESH_INTERVAL = 14 * 60 * 1000;

const clearRefreshTimer = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

const startRefreshTimer = (
  setAuthState: AuthContextType['setAuthState'],
  logout: AuthContextType['logout'],
) => {
  clearRefreshTimer();

  refreshTimer = setTimeout(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return logout();

      const res = await refreshTokenApi({ refreshToken });

      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);

      setAuthState({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });

      updateSocketAuth(res.data.accessToken);
      startRefreshTimer(setAuthState, logout);
    } catch {
      logout();
      toast.error('Session expired. Please sign in again.');
    }
  }, REFRESH_INTERVAL);
};

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

export const setupAxiosInterceptors = (
  logout: AuthContextType['logout'],
  setAuthState: AuthContextType['setAuthState'],
) => {
  const token = localStorage.getItem('accessToken');
  if (token) startRefreshTimer(setAuthState, logout);

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
    (res) => res,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
        }

        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) throw new Error('No refresh token');

          const res = await refreshTokenApi({ refreshToken });

          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('refreshToken', res.data.refreshToken);

          setAuthState({
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
          });

          updateSocketAuth(res.data.accessToken);

          processQueue(null, res.data.accessToken);
          startRefreshTimer(setAuthState, logout);

          return axios(originalRequest);
        } catch (err) {
          processQueue(err as AxiosError, null);
          logout();
          clearRefreshTimer();
          toast.error('Session expired. Please sign in again.');
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
    clearRefreshTimer();
  };
};
