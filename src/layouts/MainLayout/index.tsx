import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { PanelToggle } from '@/components/CommentsActivityPanel/PanelToggle';
import { Header } from '@/components/Header';

import { Sidebar } from '@/components/Sidebar';
import { ToolPalette } from '@/components/ToolPalette';
import { RouteWrapper } from '@/routes/RouteWrapper';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RouteWrapper>
      <div className="flex min-h-screen bg-muted text-muted-foreground relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex flex-col flex-1">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          <div className="flex flex-1">
            <main className="flex-1 overflow-y-auto relative">
              <ToolPalette />
              <Outlet />
              <PanelToggle />
            </main>
          </div>
        </div>
      </div>
    </RouteWrapper>
  );
};
