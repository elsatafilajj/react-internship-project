import { CircleUserRound, Crown } from 'lucide-react';
import { useParams } from 'react-router-dom';

import { useGetAllRoomsQuery } from '@/api/Room/room.queries';
import { useGetAllUsersByRoomQuery } from '@/api/User/user.query';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuthContext } from '@/context/AuthContext/AuthContext';

export const RoomParticipantsPanel = () => {
  const { roomId } = useParams<{ roomId: string }>();

  const { user } = useAuthContext();

  const { data: participants, isSuccess: isUsersDataSuccess } =
    useGetAllUsersByRoomQuery(roomId || '');

  const { data: rooms, isSuccess: isRoomDataSuccess } = useGetAllRoomsQuery();

  let currentRoom;

  if (isRoomDataSuccess && rooms.data) {
    currentRoom = rooms.data.find(
      (roomWithRole) => roomWithRole.room.uuid === roomId,
    );
  }

  const isHost = currentRoom?.role === 'host';

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex -space-x-2 cursor-pointer">
          {isUsersDataSuccess &&
            participants.data &&
            participants?.data.slice(0, 4).map((user, i) => (
              <div
                className="h-8 w-8 rounded-full bg-secondary text-sm font-medium border-2 border-foreground flex items-center justify-center shadow"
                key={i}
              >
                <p className="text-accent-foreground capitalize">
                  {user.firstName[0]}
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
          <p className="text-sm tracking-wider">
            Participants joined in {currentRoom?.room.title}
          </p>
          {isUsersDataSuccess &&
            participants?.data.map((participant) => (
              <div className="flex items-center justify-between px-5 py-3 border bg-muted shadow-sm rounded-md w-full">
                <div className="flex gap-5 items-center">
                  <div>
                    {isHost && (
                      <Crown
                        strokeWidth={0.5}
                        className="absolute top-10 left-12 w-3.5 rotate-15 hover:animate-accordion-down"
                      />
                    )}
                    <CircleUserRound
                      className="relative w-8"
                      strokeWidth={1.3}
                      size={30}
                    />
                  </div>
                  <p className="text-sm tracking-wider">
                    {participant.firstName} {participant.lastName}
                  </p>
                </div>
                {isHost && user?.uuid !== participant.uuid && (
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
