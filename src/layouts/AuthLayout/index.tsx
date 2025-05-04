import { Outlet } from 'react-router-dom';

import { RouteWrapper } from '@/routes/RouteWrapper';

export const AuthLayout = () => {
  return (
    <RouteWrapper isAuthenticationPage>
      <div className="bg-gradient-to-b from-background to-white dark:bg-gray-100">
        <Outlet />
        <p className="text-center text-xs text-black">
          © {new Date().getFullYear()} Stuck ™
        </p>
      </div>
    </RouteWrapper>
  );
};
