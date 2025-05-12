import { Outlet } from 'react-router-dom';

import LogoFull from '@/assets/icons/general/LogoFull';
import { RouteWrapper } from '@/routes/RouteWrapper';

export const AuthLayout = () => {
  return (
    <RouteWrapper isAuthenticationPage>
      <div className="bg-gradient-to-b from-background to-secondary">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
          <div className="max-w-[470px] w-full rounded-2xl shadow md:mt-0 xl:p-0">
            <div className="p-6 space-y-4 md:space-y-10 sm:p-8 bg-card rounded-2xl flex flex-col">
              <LogoFull />
              <Outlet />

              <p className="text-center text-xs text-foreground">
                © {new Date().getFullYear()} Stuck ™
              </p>
            </div>
          </div>
        </div>
      </div>
    </RouteWrapper>
  );
};
