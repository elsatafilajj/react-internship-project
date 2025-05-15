import { createContext, useContext } from 'react';

import { User } from '@/api/User/user.types';
import { emptyFunction } from '@/helpers/emptyFunction';

interface SetAuthStateProps {
  user?: User;
  accessToken?: string;
  refreshToken?: string;
}
export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: User;
  logout: () => void;
  setAuthState: ({
    user,
    accessToken,
    refreshToken,
  }: SetAuthStateProps) => void;
}

const AuthContextValues: AuthContextType = {
  isAuthenticated: false,
  isLoading: false,
  user: undefined,
  logout: emptyFunction,
  setAuthState: emptyFunction,
};

export const AuthContext = createContext(AuthContextValues);

export const useAuthContext = () => useContext(AuthContext);
