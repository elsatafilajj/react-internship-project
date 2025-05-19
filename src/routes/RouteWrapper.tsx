import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { UserRole } from '@/api/User/user.types';
import { Logo } from '@/components/shared/Logo';
import { RouteNames } from '@/constants/routeNames';
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
      <div className="h-screen flex items-center justify-center">
        <Logo small className="animate-pulse w-2xs" />
      </div>
    );
  }

  if (isAuthenticated && isAuthenticationPage) {
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated && !isAuthenticationPage) {
    return <Navigate to={RouteNames.Login} replace />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
