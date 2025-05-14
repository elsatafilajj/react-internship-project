import { Outlet } from 'react-router-dom';

import { Header } from '@/components/Header';
import { RouteWrapper } from '@/routes/RouteWrapper';

export const MainLayout = () => {
  return (
    <RouteWrapper>
      <Header />

      <div className="h-screen">
        <Outlet />
      </div>
    </RouteWrapper>
  );
};
