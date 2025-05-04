import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { UserRole } from '@/api/User/user.types';
import logo from '@/assets/images/logo.svg';
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

  console.log(
    'From route wrapper: ',
    `Is autheticated: ${isAuthenticated}, is authentication page: ${isAuthenticationPage}`,
  );

  if (isLoading) {
    return (
      <div
        className="flex-center"
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
