import { useMutation } from '@tanstack/react-query';
import { Archive, Settings2, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { deleteRoom } from '@/api/Room/room.client';
import {
  useGetRoomByIdQuery,
  useGetRoomHostQuery,
} from '@/api/Room/room.queries';
import { CreateEditRoomFormDialog } from '@/components/CreateEditRoomFormDialog';
import { ExportDataFormDialog } from '@/components/ExportDataFormDialog';
import { LeaveRoom } from '@/components/LeaveRoom';
import { ConfirmActionDialog } from '@/components/shared/ConfirmActionDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { socketEvents } from '@/constants/socketEvents';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { getSocket } from '@/helpers/socket';

export const RoomActionsDropDown = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const socket = useMemo(() => getSocket(), []);

  const { data: room } = useGetRoomByIdQuery(roomId || '');
  const isRoomActive = room?.data?.isActive;

  const { user } = useAuthContext();

  const deleteRoomMutation = useMutation({
    mutationFn: () => deleteRoom(roomId || ''),
    onSuccess: () => navigate('/rooms'),
  });

  const { data: roomHost } = useGetRoomHostQuery(roomId || '');
  const isUserHost = roomHost?.data?.uuid === user?.uuid;

  const handleArchiveRoom = async () => {
    socket.emit(socketEvents.ArchiveRoom, { roomId });

    setTimeout(() => {
      navigate('/rooms/archived');
    }, 300);
  };

  const handleDelete = async () => {
    try {
      if (!isRoomActive) {
        deleteRoomMutation.mutateAsync();
      } else {
        socket.emit(socketEvents.DeleteRoom, { roomId: roomId });
      }
    } catch (error) {
      console.error('Deletion failed', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div id="room-actions" className="rounded">
          <Settings2 className="w-5 h-5" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={10}
        className="flex flex-col gap-3 p-4 w-42 mt-4 mr-5"
      >
        {isUserHost && isRoomActive && <CreateEditRoomFormDialog />}
        {isUserHost && isRoomActive && (
          <DropdownMenuItem
            onClick={handleArchiveRoom}
            className="gap-4 ml-0.5"
          >
            <span>
              {' '}
              <Archive className="text-card-revert" />
            </span>
            Archive
          </DropdownMenuItem>
        )}

        {isUserHost && (
          <ConfirmActionDialog
            className="w-full cursor-pointe flex"
            triggerButtonName={
              <div className="ml-0.5 flex gap-4">
                <Trash2 /> Delete
              </div>
            }
            title="You are about to delete this room."
            message="This action cannot be undone. This will permanently delete your
          room."
            onConfirm={handleDelete}
          />
        )}

        <ExportDataFormDialog />

        {!isUserHost && (
          <DropdownMenuItem>
            <LeaveRoom />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
