import { PanelLeft, UserCircle2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useGetRoomByIdQuery } from '@/api/Room/room.queries';
import { RoomActionsDropDown } from '@/components/RoomActionDropDown';
import { DesktopParticipantsToggle } from '@/components/RoomParticipantsPanel/DesktopParticipantsToggle';
import { ShareLinkAlertDialog } from '@/components/ShareLinkAlertDialog';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
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

  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 w-full flex flex-wrap items-center justify-between gap-4 px-4 py-1.5 border-b bg-secondary shadow-sm sm:flex-nowrap">
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
        <div className="hidden md:flex items-center text-center gap-3">
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

          <span className="text-base font-semibold text-foreground">
            {room?.data?.title}
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 sm:gap-4">
        {hasEnteredRoom && <RoomActionsDropDown />}

        {hasEnteredRoom && <ShareLinkAlertDialog />}

        <Tooltip>
          <TooltipTrigger className="mr-2.5">
            <div ref={profileRef}>
              <UserCircle2
                strokeWidth={1.5}
                size={40}
                onClick={() => navigate('/profile')}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={-5} side="bottom">
            Profile
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
};
