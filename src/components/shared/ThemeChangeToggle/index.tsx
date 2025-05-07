import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';

import { Toggle } from '@/components/ui/toggle';
import {
  ThemeContextType,
  useThemeContext,
} from '@/context/ThemeContext/ThemeContext';

export function ThemeChangeToggle() {
  const { changeTheme, theme } = useThemeContext();

  const [selectedTheme, setSelectedTheme] =
    useState<ThemeContextType['theme']>(theme);

  changeTheme(selectedTheme);

  const handleModeSwitch = () => {
    setSelectedTheme((prev) => {
      if (prev === 'os') {
        return 'os';
      } else if (prev === 'light') {
        return 'dark';
      } else {
        return 'light';
      }
    });
  };

  return (
    <Toggle onClick={handleModeSwitch} size="lg" aria-label="Toggle Theme">
      {theme === 'light' ? <Moon /> : <Sun />}
    </Toggle>
  );
}
