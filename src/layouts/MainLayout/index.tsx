import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { CommentsActivityPanelToggle } from '@/components/CommentsActivityPanel/CommentsActivityPanelToggle';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { ToolPalette } from '@/components/ToolPalette/ToolPalette';
import { RouteWrapper } from '@/routes/RouteWrapper';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RouteWrapper>
      <div className="flex min-h-screen bg-muted text-muted-foreground">
        {sidebarOpen && <Sidebar />}

        <div className="flex flex-col flex-1">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          <div className="flex flex-1 url-[test]">
            <main className="flex-1 overflow-y-auto  relative">
              <ToolPalette />
              <Outlet />
              <CommentsActivityPanelToggle />
            </main>
          </div>
        </div>
      </div>
    </RouteWrapper>
  );
};
