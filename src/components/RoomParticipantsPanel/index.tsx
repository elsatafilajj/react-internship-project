import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CircleUserRound, Crown } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { removeUserFromRoom } from '@/api/Room/room.client';
import { useGetAllUsersByRoomQuery } from '@/api/User/user.query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthContext } from '@/context/AuthContext/AuthContext';

export const RoomParticipantsPanel = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuthContext();

  const queryClient = useQueryClient();

  const { data: participants, isFetching } = useGetAllUsersByRoomQuery(
    roomId || '',
  );

  const removeUserFromRoomMutation = useMutation({
    mutationFn: (participantId: string) =>
      removeUserFromRoom(roomId || '', participantId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const roomHost = participants?.data?.find((user) => user.role === 'host');

  return (
    <div className="flex flex-col items-center gap-2 mt-1 p-3">
      <p className="text-sm tracking-wider mb-3">Participants</p>
      {isFetching && (
        <>
          <Skeleton className="w-[18rem] h-14" />
          <Skeleton className="w-[18rem] h-14" />
          <Skeleton className="w-[18rem] h-14" />
          <Skeleton className="w-[18rem] h-14" />
          <Skeleton className="w-[18rem] h-14" />
          <Skeleton className="w-[18rem] h-14" />
          <Skeleton className="w-[18rem] h-14" />
          <Skeleton className="w-[18rem] h-14" />
          <Skeleton className="w-[18rem] h-14" />
          <Skeleton className="w-[18rem] h-14" />
          <Skeleton className="w-[18rem] h-14" />
          <Skeleton className="w-[18rem] h-14" />
        </>
      )}
      {participants &&
        participants.data &&
        participants?.data.map((participant) => (
          <div className="flex items-center justify-between px-5 py-3 border bg-muted shadow-sm rounded-md w-full">
            <div className="flex gap-5 items-center">
              <div>
                {participant.role === 'host' && (
                  <Crown className="absolute top-[3.5rem] left-7 w-3.5 -rotate-40 hover:animate-caret-blink " />
                )}
                <CircleUserRound
                  className="relative w-8"
                  strokeWidth={1.3}
                  size={30}
                />
              </div>
              <p className="text-sm tracking-wider">
                {participant.firstname} {participant.lastname}
              </p>
            </div>
            {roomHost &&
              roomHost.uuid === user?.uuid &&
              participant.uuid !== user.uuid && (
                <Button
                  variant="destructiveSecondary"
                  size="sm"
                  onClick={() =>
                    removeUserFromRoomMutation.mutateAsync(participant.uuid)
                  }
                >
                  Kick
                </Button>
              )}
          </div>
        ))}
    </div>
  );
};
