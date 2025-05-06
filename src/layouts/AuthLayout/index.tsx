import { Outlet } from 'react-router-dom';

import logoFull from '@/assets/images/logo-full.svg';
import { RouteWrapper } from '@/routes/RouteWrapper';

export const AuthLayout = () => {
  return (
    <RouteWrapper isAuthenticationPage>
      <div className="bg-gradient-to-b from-background to-white dark:bg-gray-100">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
          <div className="max-w-[470px] w-full rounded-2xl shadow dark:border md:mt-0 xl:p-0">
            <div className="p-6 space-y-4 md:space-y-10 sm:p-8 bg-white rounded-2xl flex flex-col">
              <a
                href="#"
                className="flex self-center items-center mb-6 text-5xl font-semibold text-gray-900 dark:text-white"
              >
                <img className="w-auto h-8 mr-2" src={logoFull} alt="logo" />
              </a>

              <Outlet />

              <p className="text-center text-xs text-black">
                © {new Date().getFullYear()} Stuck ™
              </p>
            </div>
          </div>
        </div>
      </div>
    </RouteWrapper>
  );
};
