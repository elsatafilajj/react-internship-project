import { useMutation } from '@tanstack/react-query';
import { EllipsisVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import { deleteRoom } from '@/api/Room/room.client';
import { useGetRoomByIdQuery } from '@/api/Room/room.queries';
import { CreateEditRoomFormDialog } from '@/components/CreateEditRoomFormDialog';
import { ConfirmActionDialog } from '@/components/shared/ConfirmActionDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RouteNames } from '@/constants/routeNames';
import { socketEvents } from '@/constants/socketEvents';
import { getSocket } from '@/helpers/socket';
import { cn } from '@/lib/utils';
import { useTourRefsContext } from '@/context/TourRefsContext/TourRefsContext';

export const RoomActionsDropDown = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const socket = getSocket();

  const { roomActionsRef } = useTourRefsContext();

  const { data } = useGetRoomByIdQuery(roomId || '');

  const deleteMutation = useMutation({
    mutationFn: (roomId: string) => deleteRoom(roomId),
    onSuccess: () => {
      toast.success('Room deleted successfully!');
      navigate(RouteNames.Rooms);
    },
    onError: () => {
      toast.error('Room deletion failed.');
    },
  });

  const handleArchiveRoom = async () => {
    socket.emit(socketEvents.ArchiveRoom, { roomId });

    setTimeout(() => {
      navigate('/rooms/archived');
    }, 300);
  };
  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(roomId || ' ');
    } catch (error) {
      console.error('Deletion failed', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div ref={roomActionsRef}
          className={cn(
            'rounded',
            data?.data?.isActive === false
              ? 'cursor-not-allowed opacity-50 pointer-events-none'
              : 'cursor-pointer hover:bg-muted',
          )}
        >
          <EllipsisVertical />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={10}
        className="flex flex-col gap-3 p-4 w-42"
      >
        <CreateEditRoomFormDialog />
        <DropdownMenuItem onClick={handleArchiveRoom}>Archive</DropdownMenuItem>
        <ConfirmActionDialog
          triggerButtonName="Delete"
          title="You are about to delete this room."
          message="This action cannot be undone. This will permanently delete your
          room."
          onConfirm={handleDelete}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
