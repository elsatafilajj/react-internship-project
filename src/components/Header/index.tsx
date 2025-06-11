import { PanelLeft, User } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { useGetRoomByIdQuery } from '@/api/Room/room.queries';
import { RoomActionsDropDown } from '@/components/RoomActionDropDown';
import { RoomParticipantsPanel } from '@/components/RoomParticipantsPanel';
import { ShareLinkAlertDialog } from '@/components/ShareLinkAlertDialog';
import { TourLauncher } from '@/components/TourLauncher';
import { Logo } from '@/components/shared/Logo';
import { ThemeChangeToggle } from '@/components/shared/ThemeChangeToggle';
import { Button } from '@/components/ui/button';
import { useTourRefsContext } from '@/context/TourRefsContext/TourRefsContext';
import { useHasEnteredRoom } from '@/hooks/useHasEnteredRoom';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { roomId } = useParams<{ roomId: string }>();

  const { toggleSidebarIconRef, profileRef } = useTourRefsContext();

  const hasEnteredRoom = useHasEnteredRoom();

  const { data, isFetched } = useGetRoomByIdQuery(roomId || '');

  return (
    <header className="sticky top-0 z-30 w-full flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-b bg-secondary shadow-sm sm:flex-nowrap">
      <div className="flex items-center gap-0.5 sm:gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <div ref={toggleSidebarIconRef}>
            <PanelLeft className="h-5 w-5 " />
          </div>
        </Button>

        <Link to="/" className="block">
          <div className="block sm:hidden">
            <Logo className="drop-shadow-sm h-8" small />
          </div>
          <div className="hidden sm:block">
            <Logo className="drop-shadow-sm w-[120px]" />
          </div>
        </Link>
      </div>

      {hasEnteredRoom && (
        <div className="hidden sm:flex flex-col items-center text-center ">
          <span className="text-xs text-muted-foreground tracking-wide mb-1">
            Active Room
          </span>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0 sm:gap-2 flex-wrap justify-center sm:justify-start">
              <span className="text-base font-semibold text-foreground">
                {(isFetched && data?.data.title) || 'Untitled'}
              </span>
            </div>

            <RoomParticipantsPanel />
          </div>
        </div>
      )}

      <div className="flex items-center gap-0.5 sm:gap-3">
        {hasEnteredRoom && <RoomActionsDropDown />}

        {hasEnteredRoom && <ShareLinkAlertDialog />}

        <ThemeChangeToggle />

        <div ref={profileRef}>
          <Link
            to="/profile"
            id="profile"
            className="relative group flex items-center gap-1 rounded-4xl p-1  border-2 border-foreground text-foreground text-sm font-medium shadow cursor-pointer"
          >
            <User />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-primary text-black text-xs px-2 py-1 rounded shadow">
              Profile
            </span>
          </Link>
        </div>

        <TourLauncher onToggleSidebar={onToggleSidebar} />
      </div>
    </header>
  );
};
