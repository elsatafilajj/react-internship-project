import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Crown } from 'lucide-react';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { removeUserFromRoom } from '@/api/Room/room.client';
import { useGetAllUsersByRoomQuery } from '@/api/User/user.query';
import { avatarColors } from '@/components/RoomParticipantsPanel/ParticipantsToggle';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { queryKeys } from '@/constants/queryKeys';
import { socketEvents } from '@/constants/socketEvents';
import { useAuthContext } from '@/context/AuthContext/AuthContext';
import { getSocket } from '@/helpers/socket';

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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.getUsers() }),
  });

  const roomHost = participants?.data?.find((user) => user.role === 'host');
  const socket = useMemo(() => getSocket(), []);

  return (
    <div className="flex flex-col items-center gap-2 mt-1 p-3">
      <p className="text-sm tracking-wider mb-3">Participants</p>
      <div className="flex flex-col gap-2 overflow-y-scroll w-full h-auto">
        {isFetching &&
          Array.from({ length: 10 }, (_, index) => (
            <Skeleton key={index} className="bg-muted-foreground w-full h-12" />
          ))}
      </div>
      {participants &&
        participants.data &&
        participants?.data.map((participant, index) => (
          <div
            key={participant.uuid}
            className="flex items-center justify-between px-5 py-3 border bg-muted shadow-sm rounded-md w-full"
          >
            <div className="flex gap-5 items-center">
              <div>
                <div
                  className={`relative h-10 w-10 rounded-full text-sm font-medium -ml-1 border-2 border-card flex items-center justify-center shadow ${
                    avatarColors[index % avatarColors.length]
                  }`}
                  key={participant.uuid}
                >
                  {roomHost?.uuid === participant.uuid && (
                    <Crown className="absolute h-3 -top-2.5 -left-3 -rotate-40 hover:animate-caret-blink" />
                  )}
                  <p className="text-black uppercase">
                    {participant?.firstName[0] + participant?.lastName[0]}
                  </p>
                </div>
              </div>
              <p className="text-sm tracking-wider">
                {participant.firstName} {participant.lastName}
              </p>
            </div>
            {roomHost &&
              roomHost.uuid === user?.uuid &&
              participant.uuid !== user.uuid && (
                <Button
                  size="sm"
                  variant="destructiveSecondary"
                  onClick={() => {
                    removeUserFromRoomMutation.mutateAsync(participant.uuid);
                    socket.emit(socketEvents.RemoveUser, {
                      roomId,
                      userId: participant.uuid,
                    });
                  }}
                >
                  kick
                </Button>
              )}
          </div>
        ))}
    </div>
  );
};
