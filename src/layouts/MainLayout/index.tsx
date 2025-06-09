import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { ActivityPanelToggle } from '@/components/ActivityPanel/Toggle';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import RoomContextProvider from '@/context/RoomContext/RoomContextProvider';
import { RouteWrapper } from '@/routes/RouteWrapper';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RoomContextProvider>
      <RouteWrapper>
        <div className="w-full">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <div className="">
            <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

            <main className="h-screen">
              <Outlet />
              <ActivityPanelToggle />
            </main>
          </div>
        </div>
      </RouteWrapper>
    </RoomContextProvider>
  );
};
