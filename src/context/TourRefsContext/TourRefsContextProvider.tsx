import { ReactNode, useRef } from 'react';

import { TourRefsContext, TourRefsContextType } from './TourRefsContext';

interface TourRefsContextProviderProps {
  children: ReactNode;
}

export const TourRefsContextProvider = ({
  children,
}: TourRefsContextProviderProps) => {
  const myRoomsDashboardRef = useRef<HTMLDivElement | null>(null);

  const toggleSidebarIconRef = useRef<HTMLDivElement | null>(null);
  const createEditRoomRef = useRef<HTMLDivElement | null>(null);
  const archiveRef = useRef<HTMLDivElement | null>(null);
  const shareLinkRef = useRef<HTMLDivElement | null>(null);
  const changeThemeRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const tourRef = useRef<HTMLDivElement | null>(null);
  const activityRef = useRef<HTMLDivElement | null>(null);
  const noteDragRef = useRef<HTMLDivElement | null>(null);

  const tourRefsContext: TourRefsContextType = {
    myRoomsDashboardRef,
    toggleSidebarIconRef,
    createEditRoomRef,
    archiveRef,
    shareLinkRef,
    changeThemeRef,
    profileRef,
    tourRef,
    activityRef,
    noteDragRef,
  };

  return (
    <TourRefsContext.Provider value={tourRefsContext}>
      {children}
    </TourRefsContext.Provider>
  );
};
