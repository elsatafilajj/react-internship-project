import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { ActivityPanelToggle } from '@/components/ActivityPanel/Toggle';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { NoteProvider } from '@/context/NoteContext/NoteContextProvider';
import { RouteWrapper } from '@/routes/RouteWrapper';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RouteWrapper>
      <NoteProvider>
        <div className="w-full">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <div className="">
            <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <main className="h-screen">
              <Outlet />
              <ActivityPanelToggle />
            </main>
          </div>
        </div>
      </NoteProvider>
    </RouteWrapper>
  );
};
