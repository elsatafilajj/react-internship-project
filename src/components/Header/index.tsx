import { PanelLeft, User } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { useGetRoomByIdQuery } from '@/api/Room/room.queries';
import { useGetAllUsersByRoomQuery } from '@/api/User/user.query';
import { RoomActionsDropDown } from '@/components/RoomActionDropDown';
import { DesktopParticipantsToggle } from '@/components/RoomParticipantsPanel/DesktopParticipantsToggle';
import { ShareLinkAlertDialog } from '@/components/ShareLinkAlertDialog';
import { TourLauncher } from '@/components/TourLauncher';
import { Logo } from '@/components/shared/Logo';
import { ThemeChangeToggle } from '@/components/shared/ThemeChangeToggle';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { useTourRefsContext } from '@/context/TourRefsContext/TourRefsContext';
import { useHasEnteredRoom } from '@/hooks/useHasEnteredRoom';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { roomId } = useParams<{ roomId: string }>();
  const { toggleSidebarIconRef, profileRef } = useTourRefsContext();

  const hasEnteredRoom = useHasEnteredRoom();

  const { data: room } = useGetRoomByIdQuery(roomId || '');

  const { user } = useAuthContext();
  const { data: users } = useGetAllUsersByRoomQuery(roomId || '');

  const roomHost = users?.data.find((user) => user.role === 'host');
  const isUserHost = roomHost?.uuid === user?.uuid;

  return (
    <header className="sticky top-0 z-30 w-full flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-b bg-secondary shadow-sm sm:flex-nowrap">
      <div className="flex items-center gap-0.5 sm:gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <div ref={toggleSidebarIconRef}>
            <PanelLeft className="h-5 w-5" />
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
        <div className="flex flex-col gap-2 items-center">
          <span className="text-xs text-black tracking-wide mb-1">
            <p
              className={cn(
                'border px-2 py-1 m-1 rounded-2xl text-foreground',
                room?.data.isActive ? 'bg-green-500' : 'bg-red-500',
              )}
            >
              {room?.data.isActive ? 'Active Room' : 'Archived Room'}
            </p>
          </span>

          <div className="flex items-center gap-3">
            <div className="sm:flex hidden items-center gap-0 sm:gap-2 flex-wrap justify-center">
              <span className="text-base font-semibold text-foreground">
                {(room && room.data && room?.data.title) || 'Untitled'}
              </span>
            </div>

            <DesktopParticipantsToggle />
          </div>
        </div>
      )}

      <div className="flex items-center gap-0.5 sm:gap-3">
        {hasEnteredRoom && isUserHost && <RoomActionsDropDown />}

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
