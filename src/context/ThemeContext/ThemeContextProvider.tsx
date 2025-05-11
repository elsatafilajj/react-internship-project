import { useEffect, useState, ReactNode } from 'react';

import { ThemeContext, ThemeMode } from './ThemeContext';

interface ThemeContextProviderProps {
  children: ReactNode;
}

const getSystemTheme = (): ThemeMode =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';

  const storedTheme = localStorage.getItem('theme') as ThemeMode | null;
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  const systemTheme = getSystemTheme();
  localStorage.setItem('theme', systemTheme);
  return systemTheme;
};

const ThemeContextProvider = ({ children }: ThemeContextProviderProps) => {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const changeTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
