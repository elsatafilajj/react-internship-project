import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DoorOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import { leaveRoom } from '@/api/Room/room.client';
import { queryKeys } from '@/constants/queryKeys';
import { socketEvents } from '@/constants/socketEvents';
import { getSocket } from '@/helpers/socket';

export const LeaveRoom = () => {
  const queryClient = useQueryClient();
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const socket = getSocket();

  const leaveRoomMutation = useMutation({
    mutationFn: (roomId: string) => leaveRoom(roomId),
    onSuccess: () => {
      socket.emit(socketEvents.RoomLeaveP, { roomId });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getUsers(),
      });
      toast.success('You left the room!');
      navigate('/rooms');
    },
  });

  return (
    <button
      className="bg-transparent text-red-600 w-full font-medium self-start ml-0.5 gap-4 flex items-center"
      onClick={() => {
        leaveRoomMutation.mutateAsync(roomId || '');
      }}
    >
      <DoorOpen className="w-7 h-7 text-red-600" />
      Leave
    </button>
  );
};
