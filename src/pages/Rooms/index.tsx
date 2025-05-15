import { useQuery } from '@tanstack/react-query';

import { getAllRooms } from '@/api/Room/room.client';
import { Room } from '@/components/Room';

export const Rooms = () => {
  const {
    data: rooms,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['rooms'],
    queryFn: getAllRooms,
  });

  if (isLoading)
    return <p className="text-center mt-10 text-gray-600">Loading rooms...</p>;
  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">
        Error: {(error as Error).message}
      </p>
    );

  return (
    <div className="px-4 py-8 max-w-8xl rounded-3xl mx-auto">
      <h1 className="flex justify-center">Active Rooms</h1>
      <div className="grid gap-6 m-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {rooms?.data.map((roomData) => (
          <Room
            key={roomData.room.uuid}
            title={roomData.room.title}
            updatedAt={roomData.room.updatedAt}
          />
        ))}
      </div>
    </div>
  );
};
