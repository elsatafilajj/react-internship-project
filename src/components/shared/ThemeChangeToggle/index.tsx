import { Moon, Sun } from 'lucide-react';

import { TourRefs } from '@/components/TourSteps/TourSteps';
import { Toggle } from '@/components/ui/toggle';
import { useThemeContext } from '@/context/ThemeContext/ThemeContext';

export function ThemeChangeToggle() {
  const { changeTheme, theme } = useThemeContext();

  const toggleTheme = () => {
    changeTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div ref={TourRefs.changeThemeRef}>
      <Toggle
        onClick={toggleTheme}
        className="cursor-pointer"
        size="lg"
        aria-label="Toggle Theme"
      >
        {theme === 'light' ? <Moon /> : <Sun />}
      </Toggle>
    </div>
  );
}
