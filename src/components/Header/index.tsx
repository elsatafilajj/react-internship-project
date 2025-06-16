import { CircleUser, PanelLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useGetRoomByIdQuery } from '@/api/Room/room.queries';
import { useGetAllUsersByRoomQuery } from '@/api/User/user.query';
import { LeaveRoom } from '@/components/LeaveRoom';
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

  const navigate = useNavigate();

  const { user } = useAuthContext();
  const { data: users } = useGetAllUsersByRoomQuery(roomId || '');

  const roomHost = users?.data.find((user) => user.role === 'host');
  const isUserHost = roomHost?.uuid === user?.uuid;

  return (
    <header className="sticky top-0 z-30 w-full flex items-center justify-between gap-4 px-4 py-2 border-b bg-secondary shadow-sm">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <div ref={toggleSidebarIconRef}>
            <PanelLeft className="h-5 w-5 text-muted-foreground" />
          </div>
        </Button>

        <Link to="/" className="block">
          <Logo className="drop-shadow-sm w-28" />
        </Link>
      </div>

      {hasEnteredRoom && (
        <div className="hidden md:flex items-center gap-4">
          <div
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm',
              room?.data?.isActive ? 'bg-green-500' : 'bg-red-500',
            )}
          >
            {room?.data?.isActive ? 'Active Room' : 'Archived Room'}
          </div>

          <span className="text-sm font-semibold text-foreground">
            {room?.data?.title}
          </span>
        </div>
      )}

      <div className="flex items-center gap-2">
        {hasEnteredRoom && <DesktopParticipantsToggle />}

        {hasEnteredRoom && <ShareLinkAlertDialog />}

        {hasEnteredRoom && <LeaveRoom />}

        {hasEnteredRoom && isUserHost && <RoomActionsDropDown />}

        <Tooltip>
          <TooltipTrigger className="rounded-full hover:ring-2 hover:ring-muted">
            <div ref={profileRef} className="p-1">
              <CircleUser
                strokeWidth={1.5}
                size={32}
                className="text-muted-foreground"
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
