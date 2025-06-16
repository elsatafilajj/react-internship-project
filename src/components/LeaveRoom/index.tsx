import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import { leaveRoom } from '@/api/Room/room.client';
import { Button } from '@/components/ui/button';
import { queryKeys } from '@/constants/queryKeys';
import { getSocket } from '@/helpers/socket';

export const LeaveRoom = () => {
  const queryClient = useQueryClient();
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const socket = getSocket();

  const leaveRoomMutation = useMutation({
    mutationFn: (roomId: string) => leaveRoom(roomId),
    onSuccess: () => {
      socket.emit('rooms/leaveP', { roomId });
      queryClient.invalidateQueries({
        queryKey: queryKeys.getUsers(),
      });
      toast.success('You left the room!');
      navigate('/rooms');
    },
  });

  return (
    <Button
      size="sm"
      className="bg-red hover:bg-destructive"
      onClick={() => {
        leaveRoomMutation.mutateAsync(roomId || '');
      }}
    >
      Leave
    </Button>
  );
};
