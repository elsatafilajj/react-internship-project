import { useMutation } from '@tanstack/react-query';
import { Archive, FolderOpenDot, Settings2, Trash2 } from 'lucide-react';
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
import { RouteNames } from '@/constants/routeNames';
import { socketEvents } from '@/constants/socketEvents';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { getSocket } from '@/helpers/socket';

export const RoomActionsDropDown = () => {
  const navigate = useNavigate();
  const socket = getSocket();

  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuthContext();
  const { data: room } = useGetRoomByIdQuery(roomId || '');
  const { data: roomHost } = useGetRoomHostQuery(roomId || '');

  const isRoomActive = room?.data?.isActive;
  const isUserHost = roomHost?.data?.uuid === user?.uuid;

  const handleUnArchiveRoom = async () => {
    socket.emit(socketEvents.UnarchiveRoom, { roomId });

    setTimeout(() => {
      navigate(RouteNames.Rooms);
    }, 300);
  };

  const handleArchiveRoom = async () => {
    socket.emit(socketEvents.ArchiveRoom, { roomId });

    setTimeout(() => {
      navigate(RouteNames.ArchivedRooms);
    }, 300);
  };

  const deleteRoomMutation = useMutation({
    mutationFn: () => deleteRoom(roomId || ''),
    onSuccess: () => navigate(RouteNames.Rooms),
  });

  const handleDelete = async () => {
    try {
      if (!isRoomActive) {
        deleteRoomMutation.mutateAsync();
      } else {
        socket.emit(socketEvents.DeleteRoom, { roomId: roomId });
      }

      console.log(roomId);
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

        {!isRoomActive && isUserHost && (
          <DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleUnArchiveRoom}
              className="gap-4 p-0 px-1 cursor-pointer"
            >
              <span>
                <FolderOpenDot className="text-card-revert" />
              </span>
              Activate
            </DropdownMenuItem>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
