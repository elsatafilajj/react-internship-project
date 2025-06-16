import { Moon, Sun } from 'lucide-react';

import { Toggle } from '@/components/ui/toggle';
import { useThemeContext } from '@/context/ThemeContext/ThemeContext';

export function ThemeChangeToggle() {
  const { changeTheme, theme } = useThemeContext();

  const toggleTheme = () => {
    changeTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div id="theme">
      <Toggle
        onClick={toggleTheme}
        className="cursor-pointer hover:bg-muted w-full flex justify-start px-3 py-4.5 gap-4 items-center"
        size="sm"
        variant={'ghost'}
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? (
          <>
            <Sun />
            <p>Light Mode</p>
          </>
        ) : (
          <>
            <Moon />

            <p>Dark Mode</p>
          </>
        )}
      </Toggle>
    </div>
  );
}
