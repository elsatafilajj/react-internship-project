import { createContext, useContext } from 'react';

import { User } from '@/api/User/user.types';
import { emptyFunction } from '@/helpers/emptyFunction';

interface SetUserProps {
  user?: User;
  accessToken?: string;
  refreshToken?: string;
}
export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: User;
  setUser: ({ user, accessToken, refreshToken }: SetUserProps) => void;
  logout: () => void;
  updateUser: (tokens: { accessToken: string; refreshToken: string }) => void;
}

const AuthContextValues: AuthContextType = {
  isAuthenticated: false,
  isLoading: false,
  user: undefined,
  setUser: emptyFunction,
  logout: emptyFunction,
  updateUser: emptyFunction,
};

export const AuthContext = createContext(AuthContextValues);

export const useAuthContext = () => useContext(AuthContext);
