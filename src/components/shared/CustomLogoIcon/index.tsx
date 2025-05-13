import { LogoDarkIcon } from '@/assets/icons/general/LogoDark';
import { LogoLightIcon } from '@/assets/icons/general/LogoLight';
import { LogoSmallIcon } from '@/assets/icons/general/LogoSmall';
import { useThemeContext } from '@/context/ThemeContext/ThemeContext';

interface CustomLogoProps {
  small?: boolean;
  width?: string;
  className?: string;
}
export const CustomLogoIcon = ({
  small = false,
  width,
  className,
}: CustomLogoProps) => {
  const { theme } = useThemeContext();
  return (
    <>
      {small && <LogoSmallIcon width={width} className={className} />}
      {!small && theme === 'light' && (
        <LogoDarkIcon width={width} className={className} />
      )}
      {!small && theme === 'dark' && (
        <LogoLightIcon width={width} className={className} />
      )}
    </>
  );
};
