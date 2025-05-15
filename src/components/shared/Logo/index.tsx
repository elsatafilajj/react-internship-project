import { LogoDarkIcon } from '@/assets/icons/general/LogoDark';
import { LogoLightIcon } from '@/assets/icons/general/LogoLight';
import { LogoSmallIcon } from '@/assets/icons/general/LogoSmall';
import { useThemeContext } from '@/context/ThemeContext/ThemeContext';

interface LogoProps {
  small?: boolean;
  width?: string;
  className?: string;
}
export const Logo = ({ small = false, className }: LogoProps) => {
  const { theme } = useThemeContext();

  const LogoComponent = small
    ? LogoSmallIcon
    : theme === 'light'
      ? LogoDarkIcon
      : LogoLightIcon;

  return <LogoComponent className={className} />;
};
