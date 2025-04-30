import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { AuthContextType } from '@/context/AuthContext/AuthContext';

export const setupAxiosInterceptors = (logout: AuthContextType['logout']) => {
  const authMiddleware = axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  const responseMiddleware = axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please sign in again.', {
          id: 'unauthorized',
        });

        logout();
      }

      throw error;
    },
  );

  return () => {
    axios.interceptors.request.eject(authMiddleware);
    axios.interceptors.response.eject(responseMiddleware);
  };
};
