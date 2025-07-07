import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { CircleUser, PanelLeft } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useGetRoomByIdQuery } from '@/api/Room/room.queries';
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
import { queryKeys } from '@/constants/queryKeys';
import { RouteNames } from '@/constants/routeNames';
import { socketEvents } from '@/constants/socketEvents';
import { getSocket } from '@/helpers/socket';
import { useHasEnteredRoom } from '@/hooks/useHasEnteredRoom';
import { cn } from '@/lib/utils';
import { ErrorResponseData } from '@/types/ErrorResponse';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { roomId } = useParams<{ roomId: string }>();

  const hasEnteredRoom = useHasEnteredRoom();
  const { data: room, error } = useGetRoomByIdQuery(roomId || '', false);
  const socket = useMemo(() => getSocket(), []);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on(socketEvents.EditedRoom, () => {
      queryClient.refetchQueries({
        queryKey: queryKeys.getSingleRoom(roomId || ''),
      });
    });
  }, []);

  useEffect(() => {
    if (!error) return;
    const axiosError = error as AxiosError<ErrorResponseData>;

    const status = axiosError?.response?.status;

    if (!status) return;

    if ([403, 404, 500].includes(status)) {
      const message =
        axiosError.response?.data?.message ?? 'You were removed from this room';
      toast.error(message);
      navigate(RouteNames.Rooms);
    } else if (status >= 400 && status < 600) {
      const message =
        axiosError.response?.data?.message ??
        'Something went wrong. Please try again.';
      toast.error(message);
    }
  }, [error, navigate]);

  return (
    <div className="absolute w-full">
      <div className="fixed top-3 left-3 z-10 flex flex-wrap items-center gap-0.5 sm:gap-2 rounded-2xl bg-card sm:px-4 px-2.5 sm:py-0.5 py-2.5 shadow-md text-foreground max-w-full sm:max-w-[60%]">
        <Button
          variant="ghost"
          className="p-2 w-[32px]"
          onClick={onToggleSidebar}
        >
          <PanelLeft className="h-5 w-5 text-card-revert" />
        </Button>

        <Link
          to="/"
          className="sm:flex hidden items-center space-x-2 min-w-fit"
        >
          <Logo className="hidden sm:block w-23 drop-shadow-sm" />
        </Link>

        {hasEnteredRoom && (
          <hr className="bg-muted-foreground w-[1px] h-6 mr-1" />
        )}

        {hasEnteredRoom && (
          <div className="flex items-center gap-2 min-w-0">
            <span className="sm:text-sm text-xs truncate max-w-[120px] sm:max-w-[200px]">
              {room?.data?.title}
            </span>
            <span
              className={cn(
                'w-2.5 h-2.5 rounded-full shadow-md hidden sm:flex',
                room?.data?.isActive ? 'bg-green-400' : 'bg-red-400',
              )}
            />
          </div>
        )}
      </div>

      <div className="fixed top-3 right-3 z-10 flex flex-wrap items-center gap-2 justify-end rounded-2xl bg-card px-3 py-1 shadow-md text-foreground max-w-full">
        {hasEnteredRoom && (
          <>
            <ParticipantsToggle />
            <ShareLinkAlertDialog />
            <RoomActionsDropDown />
          </>
        )}

        <Tooltip>
          <TooltipTrigger className="rounded-full cursor-pointer" asChild>
            <div id="profile" className="p-1">
              <CircleUser
                strokeWidth={1.5}
                size={32}
                className="text-card-revert"
                onClick={() => navigate(RouteNames.Profile)}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent sideOffset={-5} side="bottom">
            Profile
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
