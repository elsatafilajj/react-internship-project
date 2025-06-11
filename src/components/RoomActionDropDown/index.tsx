import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EllipsisVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import { deleteRoom, updateRoom } from '@/api/Room/room.client';
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

  const archiveMutation = useMutation({
    mutationFn: (roomId: string) => updateRoom(roomId, { isActive: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getSingleRoom(roomId || ''),
      });
      toast.success('Room archived successfully.');
      navigate('/rooms/archived');
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
      <DropdownMenuTrigger>
        <EllipsisVertical className="cursor-pointer" />
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
