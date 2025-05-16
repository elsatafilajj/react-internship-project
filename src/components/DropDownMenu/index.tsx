import { EllipsisVertical } from 'lucide-react';

import { DeleteRoomDialog } from '@/components/DeleteRoomDialog';
import { EditRoomFormDialog } from '@/components/EditRoomFormDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const DropDownMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <EditRoomFormDialog />
        <DropdownMenuItem>Archive</DropdownMenuItem>
        <DeleteRoomDialog />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
