import { Outlet } from 'react-router-dom';

import { RouteWrapper } from '@/routes/RouteWrapper';

import './AuthLayout.css';

export const AuthLayout = () => {
  return (
    <RouteWrapper isAuthenticationPage>
      <div className="auth-layout">
        <div className="auth-layout__bg-image" />

        <div className="auth-layout__form-container">
          <div className="auth-layout__form">
            <Outlet />
          </div>
        </div>
      </div>
    </RouteWrapper>
  );
};
