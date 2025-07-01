import { Crown } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { useGetAllUsersByRoomQuery } from '@/api/User/user.query';
import { RoomParticipantsPanel } from '@/components/RoomParticipantsPanel';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';

export const avatarColors = [
  'bg-red-200',
  'bg-green-200',
  'bg-blue-200',
  'bg-yellow-200',
  'bg-purple-200',
  'bg-pink-200',
  'bg-orange-200',
];

export const ParticipantsToggle = () => {
  const { roomId } = useParams<{ roomId: string }>();

  const { data: participants, isLoading } = useGetAllUsersByRoomQuery(
    roomId || '',
  );

  const roomHost = participants?.data?.find((user) => user.role === 'host');

  return (
    <div id="participants">
      <Sheet>
        <SheetTrigger asChild>
          <div className="-space-x-2 flex ml-3 cursor-pointer py-1.5">
            {isLoading && (
              <div className="flex -space-x-2">
                {Array.from({ length: 3 }, (_, index) => (
                  <Skeleton
                    key={index}
                    className="h-8 w-8 rounded-full bg-muted-foreground"
                  />
                ))}
              </div>
            )}
            {participants &&
              participants.data &&
              participants?.data?.slice(0, 4).map((participant, index) => (
                <div
                  className={`relative sm:flex hidden h-8.5  w-8.5 rounded-full text-sm font-medium -ml-0.5 border-2 border-card items-center justify-center shadow ${
                    avatarColors[index % avatarColors.length]
                  }`}
                  key={participant.uuid}
                >
                  {roomHost?.uuid === participant.uuid && (
                    <Crown className="absolute h-3 -top-2 -left-3 -rotate-40 hover:animate-caret-blink" />
                  )}
                  <p className="text-black uppercase">
                    {participant.firstName[0] + participant.lastName[0]}
                  </p>
                </div>
              ))}
            {
              <div
                className={`relative sm:hidden flex h-9 w-9 rounded-full text-sm font-medium -ml-0.5 border-2 border-card items-center justify-center shadow ${
                  avatarColors[2]
                }`}
              >
                <Crown className="absolute h-3 -top-2 -left-3 -rotate-40 hover:animate-caret-blink" />

                <p className="text-black capitalize">
                  {roomHost
                    ? roomHost?.firstName[0] + roomHost?.lastName[0]
                    : 'RH'}
                </p>
              </div>
            }
            {participants && participants.data && (
              <div className="flex flex-col items-center ml-2 -mt-1.5 hover:animate-in">
                <p className="text-xs text-muted-foreground">
                  {participants?.data?.length > 3 &&
                    `+ ${participants?.data?.length - 3}`}
                </p>
              </div>
            )}
          </div>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="bg-card w-xs top-18 max-h-[92vh] rounded-s-xl"
        >
          <RoomParticipantsPanel />
        </SheetContent>
      </Sheet>
    </div>
  );
};
