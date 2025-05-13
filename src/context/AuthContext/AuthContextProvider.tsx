import { ReactNode, useEffect, useState } from 'react';

import { getUserDetails } from '@/api/User/user.client';
import { User } from '@/api/User/user.types';
import { setupAxiosInterceptors } from '@/api/setupAxiosInterceptors';

import { AuthContext, AuthContextType } from './AuthContext';

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const axiosInterceptor = setupAxiosInterceptors(logout, setAuthState);

    return () => {
      axiosInterceptor();
    };
  }, []);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
          return;
        }

        const response = await getUserDetails();
        setUser(response.data);
      } catch {
        localStorage.removeItem('accessToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const setAuthState = ({
    user,
    accessToken,
    refreshToken,
  }: {
    user?: User;
    accessToken?: string;
    refreshToken?: string;
  }) => {
    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
    if (user) {
      setUser(user);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(undefined);
  };

  const context: AuthContextType = {
    isAuthenticated: !!user,
    setAuthState,
    isLoading,
    logout,
    user,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};
