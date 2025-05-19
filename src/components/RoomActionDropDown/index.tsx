import { EllipsisVertical } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { useGetRoomByIdQuery } from '@/api/Room/room.queries';
import { CreateEditRoomFormDialog } from '@/components/CreateEditRoomFormDialog';
import { DeleteRoomDialog } from '@/components/DeleteRoomDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const RoomActionsDropDown = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { data: room } = useGetRoomByIdQuery(roomId || '');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <CreateEditRoomFormDialog title={room?.data.title || ''} />
        <DropdownMenuItem>Archive</DropdownMenuItem>
        <DeleteRoomDialog />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
