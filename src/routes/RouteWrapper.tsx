import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { UserRole } from '@/api/User/user.types';
import logo from '@/assets/images/logo-small.svg';
import { useAuthContext } from '@/context/AuthContext/AuthContext';

interface RouteWrapperProps {
  children: ReactNode;
  isAuthenticationPage?: boolean;
  allowedRoles?: UserRole[];
}

export const RouteWrapper = ({
  children,
  isAuthenticationPage = false,
  allowedRoles,
}: RouteWrapperProps) => {
  const { isAuthenticated, isLoading, user } = useAuthContext();

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center"
        style={{
          height: '100vh',
        }}
      >
        <img src={logo} alt="Logo" width={200} className="animate-pulse" />
      </div>
    );
  }

  if (isAuthenticated && isAuthenticationPage) {
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated && !isAuthenticationPage) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
