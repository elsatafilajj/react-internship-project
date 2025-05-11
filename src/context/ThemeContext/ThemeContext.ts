import { createContext, useContext } from 'react';

import { emptyFunction } from '@/helpers/emptyFunction';

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  theme: ThemeMode;
  changeTheme: (newTheme: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  changeTheme: emptyFunction,
});

export const useThemeContext = () => useContext(ThemeContext);
