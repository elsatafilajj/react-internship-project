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
    const axiosInterceptor = setupAxiosInterceptors(logout);

    return () => {
      axiosInterceptor();
    };
  }, []);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          return;
        }

        const response = await getUserDetails();
        setUser(response.data);
      } catch {
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const updateUser = ({ user, token }: { user: User; token?: string }) => {
    if (token) {
      localStorage.setItem('token', token);
    }
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(undefined);
  };

  const context: AuthContextType = {
    isAuthenticated: !!user,

    isLoading,
    setUser: updateUser,
    logout,
    user,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};
