import { ClipboardCheck, ClipboardCopy, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useGetAllRoomsQuery } from '@/api/Room/room.queries';
import { CreateEditRoomFormDialog } from '@/components/CreateEditRoomFormDialog';
import { RoomCard } from '@/components/RoomCard';
import { useAuthContext } from '@/context/AuthContext/AuthContext';

export const Rooms = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { data: rooms, isLoading, isError, error } = useGetAllRoomsQuery();

  if (isLoading)
    return (
      <p className="text-center mt-20 text-gray-500 animate-pulse text-lg">
        Loading brainstorm rooms...
      </p>
    );

  if (isError)
    return (
      <p className="text-center mt-20 text-red-500 text-lg">
        Error: {(error as Error).message}
      </p>
    );

  const hasRooms = rooms?.data.length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary px-6 py-12 text-gray-800">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 flex items-center justify-center gap-3 animate-fade-in-down">
          <Sparkles className="text-name animate-bounce" size={32} />
          Welcome{' '}
          <span className="text-name capitalize">{user?.firstName}!</span>
        </h1>
        <p className="text-md md:text-lg text-muted-foreground leading-relaxed animate-fade-in">
          Dive into collaborative rooms where creativity meets action. Create
          ideas, share insights, and build solutions together.
        </p>
      </div>

      <div className="w-full xl:max-w-[1500px]">
        <div className="flex justify-between">
          {' '}
          <h2 className="text-lg md:text-md font-semibold text-foreground  animate-fade-in flex items-center pl-4 gap-2">
            <ClipboardCheck className="w-6 h-6" />
            Active Rooms
          </h2>
          <div className="animate-fade-in-up p-5">
            <CreateEditRoomFormDialog />
          </div>
        </div>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 w-full px-4">
          {hasRooms ? (
            rooms.data?.map((roomData) => (
              <div
                key={roomData.room.uuid}
                className="transform hover:scale-105 transition-transform duration-300 animate-fade-in-up"
              >
                <RoomCard
                  title={roomData.room.title}
                  updatedAt={roomData.room.updatedAt}
                  onClick={() => navigate(`${roomData.room.uuid}`)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full flex bg-card flex-col items-center justify-center mt-10 text-center text-muted-foreground animate-fade-in border p-8 rounded-2xl shadow-lg  w-full">
              <ClipboardCopy className="mx-auto h-12 w-12 text-name mb-4" />
              <h2 className="text-2xl font-semibold text-foreground">
                No rooms yet!
              </h2>
              <p className="text-sm mt-3 text-muted-foreground">
                Click <span className="font-semibold">+ New Room</span> to begin
                your first session.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
