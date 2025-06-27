import { AxiosError } from 'axios';
import { CircleUser, PanelLeft } from 'lucide-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useGetRoomByIdQuery } from '@/api/Room/room.queries';
import { ExportDataFormDialog } from '@/components/ExportDataFormDialog';
import { RoomActionsDropDown } from '@/components/RoomActionDropDown';
import { ParticipantsToggle } from '@/components/RoomParticipantsPanel/ParticipantsToggle';
import { ShareLinkAlertDialog } from '@/components/ShareLinkAlertDialog';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { useHasEnteredRoom } from '@/hooks/useHasEnteredRoom';
import { cn } from '@/lib/utils';
import { ErrorResponseData } from '@/types/ErrorResponse';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { roomId } = useParams<{ roomId: string }>();

  const hasEnteredRoom = useHasEnteredRoom();

  const {
    data: room,
    error,
    isError,
  } = useGetRoomByIdQuery(roomId || '', false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!error) return;

    const axiosError = error as AxiosError<ErrorResponseData>;

    const status = axiosError?.response?.status;

    if (!status) return;

    if ([403, 404, 500].includes(status)) {
      const message =
        axiosError.response?.data?.message ??
        'You were removed from this room.';
      toast.error(message);
      navigate('/rooms');
    } else if (status >= 400 && status < 600) {
      const message =
        axiosError.response?.data?.message ??
        'Something went wrong. Please try again.';
      toast.error(message);
    }
  }, [isError, error, navigate]);

  return (
    <header className="sticky top-0 z-30 w-full flex items-center justify-between gap-4 px-4 py-2 border-b bg-secondary shadow-sm">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <div id="sidebar">
            <PanelLeft className="h-5 w-5 text-muted-foreground" />
          </div>
        </Button>

        <Link to="/" className="block">
          <Logo className="hidden sm:block drop-shadow-sm w-28" />
          <Logo small className="block sm:hidden drop-shadow-sm w-8" />
        </Link>
      </div>

      {hasEnteredRoom && (
        <div className="hidden md:flex items-center gap-4">
          <div
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm',
              room?.data?.isActive ? 'bg-green-500' : 'bg-destructive',
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
        {!room?.data?.isActive && hasEnteredRoom && (
          <Button size="sm" variant="ghost">
            <ExportDataFormDialog />
          </Button>
        )}

        {hasEnteredRoom && <ParticipantsToggle />}

        {hasEnteredRoom && <ShareLinkAlertDialog />}

        {hasEnteredRoom && room?.data?.isActive && <RoomActionsDropDown />}

        <Tooltip>
          <TooltipTrigger className="rounded-full hover:ring-2 hover:ring-muted">
            <div id="profile" className="p-1">
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
