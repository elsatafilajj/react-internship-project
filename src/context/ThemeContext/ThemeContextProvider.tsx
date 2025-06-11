import { useEffect, useState, ReactNode } from 'react';

import { ThemeContext, ThemeContextType, ThemeMode } from './ThemeContext';

interface ThemeContextProviderProps {
  children: ReactNode;
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';

  const storedTheme = localStorage.getItem('theme') as ThemeMode | null;
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

  localStorage.setItem('theme', systemTheme);

  return systemTheme;
};

export const ThemeContextProvider = ({
  children,
}: ThemeContextProviderProps) => {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const changeTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const themeContext: ThemeContextType = { theme, changeTheme };

  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
};
