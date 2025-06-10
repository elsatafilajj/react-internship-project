import { createContext, useContext } from 'react';

import { User } from '@/api/User/user.types';
import { emptyFunction } from '@/helpers/emptyFunction';

interface SetAuthStateProps {
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  isUserNewlyCreated?: boolean;
}
export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: User;
  isUserNewlyCreated: boolean;
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
  isUserNewlyCreated: false,
  logout: emptyFunction,
  setAuthState: emptyFunction,
};

export const AuthContext = createContext(AuthContextValues);

export const useAuthContext = () => useContext(AuthContext);
