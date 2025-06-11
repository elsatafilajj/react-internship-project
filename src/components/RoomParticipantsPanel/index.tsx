import { CircleUserRound, Crown } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { useGetAllUsersByRoomQuery } from '@/api/User/user.query';
import { User } from '@/api/User/user.types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthContext } from '@/context/AuthContext/AuthContext';

export const RoomParticipantsPanel = () => {
  const { roomId } = useParams<{ roomId: string }>();

  const { user } = useAuthContext();

  const {
    data: participants,
    isSuccess: isUsersDataSuccess,
    isFetching,
  } = useGetAllUsersByRoomQuery(roomId || '');

  let roomHost: User | undefined;

  if (isUsersDataSuccess && participants.data) {
    roomHost = participants.data.find((user) => user.role === 'host');
    console.log(roomHost);
  }

  console.log(participants?.data);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex -space-x-2 cursor-pointer">
          {isFetching && (
            <div className="flex -space-x-2">
              <Skeleton className="h-8 w-8 rounded-full bg-muted-foreground" />
              <Skeleton className="h-8 w-8 rounded-full bg-muted-foreground" />
              <Skeleton className="h-8 w-8 rounded-full bg-muted-foreground" />
              <Skeleton className="h-8 w-8 rounded-full bg-muted-foreground" />
            </div>
          )}
          {isUsersDataSuccess &&
            participants.data &&
            participants?.data.slice(0, 4).map((user, i) => (
              <div
                className="h-8 w-8 rounded-full bg-secondary text-sm font-medium border-2 border-foreground flex items-center justify-center shadow"
                key={i}
              >
                <p className="text-accent-foreground capitalize">
                  {user.firstname[0]}
                </p>
              </div>
            ))}
          {isUsersDataSuccess && participants && (
            <div className="flex flex-col items-center ml-3 -mt-1.5 hover:animate-in">
              <p className="text-sm text-muted-foreground">
                {participants?.data.length > 4 &&
                  `+ ${participants?.data.length - 4}`}
              </p>
            </div>
          )}{' '}
        </div>
      </SheetTrigger>

      <SheetContent className="bg-card w-xs top-25 rounded-s-xl">
        <div className="flex flex-col items-center gap-2 mt-1 p-3">
          <p className="text-sm tracking-wider mb-3">Participants</p>
          {isFetching && (
            <>
              <Skeleton className="w-[18rem] h-14" />
              <Skeleton className="w-[18rem] h-14" />
              <Skeleton className="w-[18rem] h-14" />
              <Skeleton className="w-[18rem] h-14" />
              <Skeleton className="w-[18rem] h-14" />
            </>
          )}
          {isUsersDataSuccess &&
            participants.data &&
            participants?.data.map((participant) => (
              <div className="flex items-center justify-between px-5 py-3 border bg-muted shadow-sm rounded-md w-full">
                <div className="flex gap-5 items-center">
                  <div>
                    {participant.role === 'host' && (
                      <Crown className="absolute top-13 left-12 w-3.5 rotate-15 hover:animate-accordion-down" />
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
                    <Button variant="destructive" size="sm">
                      Kick
                    </Button>
                  )}
              </div>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
