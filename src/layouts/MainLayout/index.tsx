import { useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { ActivityPanelToggle } from '@/components/ActivityPanel/Toggle';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { RouteWrapper } from '@/routes/RouteWrapper';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { roomId } = useParams<{ roomId: string }>();

  const isUserInRoom = Boolean(roomId);

  return (
    <RouteWrapper>
      <div className="w-full">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="">
          <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

          <main className="h-screen">
            <Outlet />
            {isUserInRoom && <ActivityPanelToggle />}
          </main>
        </div>
      </div>
    </RouteWrapper>
  );
};
