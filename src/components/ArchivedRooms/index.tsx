import { FileArchive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useGetAllArchivedRoomsQuery } from '@/api/Room/room.queries';
import { RoomCard } from '@/components/RoomCard';

export const ArchivedRooms = () => {
  const navigate = useNavigate();

  const { data: archivedRooms } = useGetAllArchivedRoomsQuery();

  const hasRooms = archivedRooms?.data?.length;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-background to-secondary px-6 py-12 text-gray-800">
      <div className="w-full xl:max-w-[1500px]">
        <div className="flex justify-center">
          {' '}
          <h2 className="text-lg md:text-md font-semibold text-foreground  animate-fade-in flex items-center pl-4 mb-10 gap-2">
            <FileArchive className="w-6 h-6" />
            Archived Rooms
          </h2>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 w-full px-4">
          {hasRooms ? (
            archivedRooms?.data?.map((roomData) => (
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
            <div className="col-span-full flex flex-col items-center justify-center mt-10 text-center text-muted-foreground animate-fade-in border p-8 rounded-2xl shadow-lg bg-card w-full">
              <FileArchive className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground">
                No Archived Rooms yet
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                When rooms are archived, they'll appear here for review.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
