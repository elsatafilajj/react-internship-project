import { ReactNode, useState } from 'react';

import { ThemeContext, ThemeContextType } from './ThemeContext';

interface ThemeContextProviderProps {
  children: ReactNode;
}

const getInitialTheme = (): ThemeContextType['theme'] => {
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    return prefersDark ? 'dark' : 'light';
  }
  return 'os';
};

const ThemeContextProvider = ({ children }: ThemeContextProviderProps) => {
  const [theme, setTheme] =
    useState<ThemeContextType['theme']>(getInitialTheme);

  const handleChangeTheme = (newTheme: string) => {
    if (newTheme === 'light' || newTheme === 'dark' || newTheme === 'os') {
      setTheme(newTheme);
    }
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else if (theme === 'os') {
      localStorage.removeItem('theme');
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  };

  const themeContext = {
    theme,
    changeTheme: handleChangeTheme,
  };

  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
