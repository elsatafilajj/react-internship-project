import { Crown } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { useGetAllUsersByRoomQuery } from '@/api/User/user.query';
import { RoomParticipantsPanel } from '@/components/RoomParticipantsPanel';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';

export const DesktopParticipantsToggle = () => {
  const { roomId } = useParams<{ roomId: string }>();

  const { data: participants, isLoading } = useGetAllUsersByRoomQuery(
    roomId || '',
  );

  const roomHost = participants?.data?.find((user) => user.role === 'host');

  return (
    <div className="sm:flex hidden">
      <Sheet>
        <SheetTrigger asChild>
          <div className="-space-x-2 flex cursor-pointer">
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
              participants?.data.slice(0, 3).map((participant) => (
                <div
                  className="relative h-8 w-8 rounded-full bg-secondary text-sm font-medium border-2 border-foreground flex items-center justify-center shadow"
                  key={participant.uuid}
                >
                  {roomHost?.uuid === participant.uuid && (
                    <Crown className="absolute h-3 -top-2.5 -left-3 -rotate-40 hover:animate-caret-blink" />
                  )}
                  <p className="text-accent-foreground capitalize">
                    {participant.firstname[0]}
                  </p>
                </div>
              ))}
            {participants && participants.data && (
              <div className="flex flex-col items-center ml-2 -mt-1.5 hover:animate-in">
                <p className="text-xs text-muted-foreground">
                  {participants?.data.length > 3 &&
                    `+ ${participants?.data.length - 3}`}
                </p>
              </div>
            )}
          </div>
        </SheetTrigger>

        <SheetContent side="right" className="bg-card w-xs top-25 rounded-s-xl">
          <RoomParticipantsPanel />
        </SheetContent>
      </Sheet>
    </div>
  );
};
