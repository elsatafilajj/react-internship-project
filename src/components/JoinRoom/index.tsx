import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { joinRoom } from '@/api/Room/room.client';
import { queryKeys } from '@/constants/queryKeys';

export const JoinRoom = () => {
  const queryClient = useQueryClient();
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { code } = useParams();

  const joinRoomMutation = useMutation({
    mutationFn: (code: string) => joinRoom(code),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getSingleRoom(roomId || ''),
      });
      navigate(`/rooms/${data.data.room.uuid}`);
    },
  });

  useEffect(() => {
    joinRoomMutation.mutateAsync(code || '');
  }, []);

  return <div></div>;
};
