import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { joinRoom } from '@/api/Room/room.client';
import { queryKeys } from '@/constants/queryKeys';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { getSocket } from '@/helpers/socket';

export const JoinRoom = () => {
  const queryClient = useQueryClient();
  const { roomId } = useParams<{ roomId: string }>();
  const params = useParams<{ code: string }>();
  const navigate = useNavigate();
  const socket = getSocket();
  const { isAuthenticated } = useAuthContext();

  const code = params.code || localStorage.getItem('inviteCode') || '';

  const joinRoomMutation = useMutation({
    mutationFn: (code: string) => joinRoom(code),
    onSuccess: (data) => {
      localStorage.removeItem('inviteCode');
      queryClient.invalidateQueries({
        queryKey: queryKeys.getSingleRoom(roomId || ''),
      });
      navigate(`/rooms/${data?.data?.room.uuid}`);
    },
  });

  useEffect(() => {
    if (!isAuthenticated || !code) return;

    joinRoomMutation.mutateAsync(code);
    socket.emit('rooms/join', { roomId });
    queryClient.invalidateQueries({
      queryKey: queryKeys.getSingleRoom(roomId || ''),
    });

    queryClient.invalidateQueries({
      queryKey: queryKeys.getUsers(),
    });
  }, [isAuthenticated, code]);

  return <div></div>;
};
