import { Outlet } from 'react-router-dom';

import { RouteWrapper } from '@/routes/RouteWrapper';

// import './AuthLayout.css';

export const AuthLayout = () => {
  return (
    <RouteWrapper isAuthenticationPage>
      <div className="bg-gradient-to-b from-background to-white dark:bg-gray-100">
        <Outlet />
      </div>
    </RouteWrapper>
  );
};
