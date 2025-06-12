import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
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
      navigate('/rooms/archived');
    },
    onError: () => {
      toast.error('Only host can archive this room!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (roomId: string) => deleteRoom(roomId),
    onSuccess: () => {
      toast.success('Room deleted successfully!');
      navigate('/rooms');
    },
    onError: () => {
      toast.error('Room deletion failed.');
    },
  });

  const handleArchived = async () => {
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
          className={clsx(
            'p-2 rounded',
            data?.data.isActive === false
              ? 'cursor-not-allowed opacity-50 pointer-events-none'
              : 'cursor-pointer hover:bg-muted',
          )}
        >
          <EllipsisVertical />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <CreateEditRoomFormDialog />
        <DropdownMenuItem onClick={handleArchived}>Archive</DropdownMenuItem>
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
