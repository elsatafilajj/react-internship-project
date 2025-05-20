import { EllipsisVertical } from 'lucide-react';

import { CreateEditRoomFormDialog } from '@/components/CreateEditRoomFormDialog';
import { DeleteRoomDialog } from '@/components/DeleteRoomDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const RoomActionsDropDown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <CreateEditRoomFormDialog />
        <DropdownMenuItem>Archive</DropdownMenuItem>
        <DeleteRoomDialog />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
