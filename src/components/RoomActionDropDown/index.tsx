import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EllipsisVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import { deleteRoom, updateRoom } from '@/api/Room/room.client';
import { useGetRoomByIdQuery } from '@/api/Room/room.queries';
import { CreateEditRoomFormDialog } from '@/components/CreateEditRoomFormDialog';
import { ConfirmActionDialog } from '@/components/shared/ConfirmActionDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { queryKeys } from '@/constants/queryKeys';
import { RouteNames } from '@/constants/routeNames';
import { cn } from '@/lib/utils';

export const RoomActionsDropDown = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data } = useGetRoomByIdQuery(roomId || '');

  const archiveMutation = useMutation({
    mutationFn: (roomId: string) => updateRoom(roomId, { isActive: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getSingleRoom(roomId || ''),
      });
      toast.success('Room archived successfully.');
      navigate(RouteNames.ArchivedRooms);
    },
    onError: () => {
      toast.error('Only host can archive this room!');
    },
  });

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
    try {
      await archiveMutation.mutateAsync(roomId || '');
    } catch (error) {
      console.error('Archived failed', error);
    }
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
        <div
          className={cn(
            'p-2 rounded',
            data?.data.isActive === false
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
