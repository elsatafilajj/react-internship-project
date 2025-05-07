import { useContext, createContext } from 'react';

import { emptyFunction } from '@/helpers/emptyFunction';

export interface ThemeContextType {
  theme: 'light' | 'dark' | 'os';
  changeTheme: (newTheme: string) => void;
}

const ThemeContextValues: ThemeContextType = {
  theme: 'os',
  changeTheme: emptyFunction,
};

export const ThemeContext = createContext(ThemeContextValues);

export const useThemeContext = () => useContext(ThemeContext);
