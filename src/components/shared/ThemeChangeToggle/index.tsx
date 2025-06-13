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
        className="cursor-pointer hover:bg-muted w-full flex justify-start px-3 py-4.5 gap-4 items-center"
        size="sm"
        variant={'ghost'}
        aria-label="Toggle Theme"
      >
        {theme === 'light' ? (
          <>
            <Moon />
            <p>Light Mode</p>
          </>
        ) : (
          <>
            <Sun />
            <p>Dark Mode</p>
          </>
        )}
      </Toggle>
    </div>
  );
}
