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
      <div className="flex h-screen w-full text-muted-foreground overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex flex-col flex-1 overflow-hidden">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          <main className="flex-1 overflow-auto">
            <Outlet />
            <PanelToggle />
          </main>
        </div>
      </div>
    </RouteWrapper>
  );
};
