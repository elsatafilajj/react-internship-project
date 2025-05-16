import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { PanelToggle } from '@/components/CommentsActivityPanel/PanelToggle';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { RouteWrapper } from '@/routes/RouteWrapper';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RouteWrapper>
      <div className="text-muted-foreground">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="w-full">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <div>
            <main className="h-screen">
              <Outlet />
              <PanelToggle />
            </main>
          </div>
        </div>
      </div>
    </RouteWrapper>
  );
};
