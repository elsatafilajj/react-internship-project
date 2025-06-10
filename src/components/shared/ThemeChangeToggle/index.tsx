import { Moon, Sun } from 'lucide-react';

import { Toggle } from '@/components/ui/toggle';
import { useThemeContext } from '@/context/ThemeContext/ThemeContext';
import { useTourRefsContext } from '@/context/TourRefsContext/TourRefsContext';

export function ThemeChangeToggle() {
  const { changeTheme, theme } = useThemeContext();

  const toggleTheme = () => {
    changeTheme(theme === 'light' ? 'dark' : 'light');
  };

  const { changeThemeRef } = useTourRefsContext();

  return (
    <div ref={changeThemeRef}>
      <Toggle
        onClick={toggleTheme}
        className="cursor-pointer"
        size="sm"
        aria-label="Toggle Theme"
      >
        {theme === 'light' ? <Moon /> : <Sun />}
      </Toggle>
    </div>
  );
}
