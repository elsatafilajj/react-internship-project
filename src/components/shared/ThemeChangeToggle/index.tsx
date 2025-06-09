import { Moon, Sun } from 'lucide-react';

import { Toggle } from '@/components/ui/toggle';
import { useThemeContext } from '@/context/ThemeContext/ThemeContext';

export function ThemeChangeToggle() {
  const { changeTheme, theme } = useThemeContext();

  const toggleTheme = () => {
    changeTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Toggle
      onClick={toggleTheme}
      className="cursor-pointer"
      size="lg"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? <Moon /> : <Sun />}
    </Toggle>
  );
}
