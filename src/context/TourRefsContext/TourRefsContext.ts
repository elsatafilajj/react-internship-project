import { createContext, MutableRefObject, useContext } from 'react';

export interface TourRefsContextType {
  myRoomsDashboardRef: MutableRefObject<HTMLDivElement | null>;
  toggleSidebarIconRef: MutableRefObject<HTMLDivElement | null>;
  createEditRoomRef: MutableRefObject<HTMLDivElement | null>;
  archiveRef: MutableRefObject<HTMLDivElement | null>;
  shareLinkRef: MutableRefObject<HTMLDivElement | null>;
  participantsRef: MutableRefObject<HTMLDivElement | null>;
  changeThemeRef: MutableRefObject<HTMLDivElement | null>;
  exportDataRef: MutableRefObject<HTMLDivElement | null>;
  roomActionsRef: MutableRefObject<HTMLDivElement | null>;
  profileRef: MutableRefObject<HTMLDivElement | null>;
  tourRef: MutableRefObject<HTMLDivElement | null>;
  activityRef: MutableRefObject<HTMLDivElement | null>;
  noteDragRef: MutableRefObject<HTMLDivElement | null>;
}

export const TourRefsContext = createContext<TourRefsContextType>({
  myRoomsDashboardRef: { current: null },
  toggleSidebarIconRef: { current: null },
  createEditRoomRef: { current: null },
  archiveRef: { current: null },
  shareLinkRef: { current: null },
  participantsRef: { current: null },
  changeThemeRef: { current: null },
  exportDataRef: { current: null },
  roomActionsRef: { current: null },
  profileRef: { current: null },
  tourRef: { current: null },
  activityRef: { current: null },
  noteDragRef: { current: null },
});

export const useTourRefsContext = () => {
  const context = useContext(TourRefsContext);
  if (!context) {
    throw new Error('useTourRefs Context must be used within a ThemeProvider');
  }
  return context;
};
