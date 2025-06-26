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

      if (!refreshToken) {
        logout();
        return;
      }

      const response = await refreshTokenApi({ refreshToken });

      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      setAuthState({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });

      const lastRoomId = localStorage.getItem('lastRoomId');
      updateSocketAuth(response.data.accessToken, lastRoomId ?? '');

      console.log(
        'roomId from localStorage:',
        localStorage.getItem('lastRoomId'),
      );

      startRefreshTimer(setAuthState, logout);
    } catch (error) {
      logout();
      console.log(error);
      toast.error('Your session has expired. Please sign in again.');
    }
  }, REFRESH_INTERVAL);
};

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
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    startRefreshTimer(setAuthState, logout);
  }

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

          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);

          setAuthState({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          });

          const lastRoomId = localStorage.getItem('lastRoomId');
          updateSocketAuth(response.data.accessToken, lastRoomId ?? '');

          processQueue(null, response.data.accessToken);

          startRefreshTimer(setAuthState, logout);

          return axios(originalRequest);
        } catch (err) {
          processQueue(err as AxiosError, null);
          clearRefreshTimer();
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
    clearRefreshTimer();
  };
};

export const startTokenRefresh = (
  setAuthState: AuthContextType['setAuthState'],
  logout: AuthContextType['logout'],
) => {
  startRefreshTimer(setAuthState, logout);
};

export const stopTokenRefresh = () => {
  clearRefreshTimer();
};
