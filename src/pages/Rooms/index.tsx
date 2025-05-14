import { useQuery } from '@tanstack/react-query';

import { Room } from '@/components/Room';
import { roomTableData } from '@/mock/roomTableData';

export const Rooms = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomTableData,
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
      <div className="grid gap-6 m-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.map((roomData) => (
          <Room
            key={roomData.room.id}
            title={roomData.room.title}
            createdAt={roomData.room.createdAt}
          />
        ))}
      </div>
    </div>
  );
};
