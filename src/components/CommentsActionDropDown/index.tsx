import { useQueryClient } from '@tanstack/react-query';
import { EllipsisVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { queryKeys } from '@/constants/queryKeys';
import { socketEvents } from '@/constants/socketEvents';
import { getSocket } from '@/helpers/socket';

interface Props {
  roomId?: string;
  noteId: string;
  commentId: string;
  onEdit: () => void;
}

export const CommentsActionsDropDown = ({
  roomId,
  noteId,
  commentId,
  onEdit,
}: Props) => {
  const socket = getSocket();
  const queryClient = useQueryClient();

  const handleDelete = () => {
    socket.emit(socketEvents.DeletedComment, { roomId, commentId });
    queryClient.invalidateQueries({
      queryKey: queryKeys.getCommentsByNoteId(noteId),
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="icon" variant="ghost">
          <EllipsisVertical className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="z-50">
        <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-red-500">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
