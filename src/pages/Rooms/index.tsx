import { useNavigate } from 'react-router-dom';

import { useGetAllRoomsQuery } from '@/api/Room/room.queries';
import { RoomCard } from '@/components/RoomCard';

export const Rooms = () => {
  const navigate = useNavigate();
  const { data: rooms, isLoading, isError, error } = useGetAllRoomsQuery();

  if (isLoading)
    return <p className="text-center mt-10 text-gray-600">Loading rooms...</p>;
  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">
        Error: {(error as Error).message}
      </p>
    );

  return (
    <div className="min-h-screen h-auto bg-card px-4 py-8 max-w-8xl  mx-auto">
      <h1 className="flex justify-center">Active Rooms</h1>
      <div className="grid gap-6 m-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {rooms?.data
          .filter((roomData) => roomData.room)
          .map((roomData) => (
            <RoomCard
              key={roomData.room.uuid}
              title={roomData.room.title}
              updatedAt={roomData.room.updatedAt}
              onClick={() => navigate(`${roomData.room.uuid}`)}
            />
          ))}
      </div>
    </div>
  );
};
