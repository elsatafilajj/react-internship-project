import { createContext, useContext } from 'react';

import { User } from '@/api/User/user.types';
import { emptyFunction } from '@/helpers/emptyFunction';

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: User;
  setUser: ({ user, token }: { user: User; token?: string }) => void;
  logout: () => void;
}

const AuthContextValues: AuthContextType = {
  isAuthenticated: false,
  isLoading: false,
  user: undefined,
  setUser: emptyFunction,
  logout: emptyFunction,
};

export const AuthContext = createContext(AuthContextValues);

export const useAuthContext = () => useContext(AuthContext);
