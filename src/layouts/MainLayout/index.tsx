import { useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { NoteScrollProvider } from '@/context/NoteScrollContext/NoteScrollContextProvider';
import { RouteWrapper } from '@/routes/RouteWrapper';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RouteWrapper>
      <NoteScrollProvider>
        <div className="w-full">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="">
          <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

          <main className="h-screen">
            <Outlet />
           
          </main>
          </div>
        </div>
      </NoteScrollProvider>
    </RouteWrapper>
  );
};
