import { useQuery } from '@tanstack/react-query';

import { Room } from '@/components/Room';
import { roomTableData } from '@/mock/roomTableData';

export const Rooms = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomTableData,
  });

  if (isLoading) return <p>Loading rooms...</p>;
  if (isError) {
    return <p>Error: {(error as Error).message}</p>;
  }

  return (
    <div className="flex flex-wrap gap-5 m-10">
      {data!.map((roomData) => (
        <Room
          key={roomData.room.id}
          title={roomData.room.title}
          createdAt={roomData.room.createdAt}
        />
      ))}
    </div>
  );
};
