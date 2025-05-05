import { Outlet } from 'react-router-dom';

import Header from '@/components/Header';
import { RouteWrapper } from '@/routes/RouteWrapper';

export const MainLayout = () => {
  return (
    <RouteWrapper>
      <Header />

      <div className="bg-gradient-to-b from-background to-white dark:bg-gray-100 h-screen">
        <Outlet />
      </div>
    </RouteWrapper>
  );
};
