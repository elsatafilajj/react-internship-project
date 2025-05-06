import { useContext, createContext } from 'react';

import { emptyFunction } from '@/helpers/emptyFunction';

export interface ThemeContextType {
  isDark: boolean;
  changeTheme: () => void;
}

const ThemeContextValues: ThemeContextType = {
  isDark: false,
  changeTheme: emptyFunction,
};

export const ThemeContext = createContext(ThemeContextValues);

export const useThemeContext = () => useContext(ThemeContext);
