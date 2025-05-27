import { useMutation } from '@tanstack/react-query';
import { EllipsisVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import { deleteRoom } from '@/api/Room/room.client';
import { CreateEditRoomFormDialog } from '@/components/CreateEditRoomFormDialog';
import { ConfirmActionDialog } from '@/components/shared/ConfirmActionDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const RoomActionsDropDown = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

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
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <CreateEditRoomFormDialog />
        <DropdownMenuItem>Archive</DropdownMenuItem>
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
