import { useParams } from 'react-router-dom';

import { useGetRoomByIdQuery } from '@/api/Room/room.queries';

export const RoomDetails = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { data, isLoading, isError, error } = useGetRoomByIdQuery(roomId || '');

  if (isLoading) return <p>Loading room dashboard...</p>;

  if (isError)
    return <p className="text-red-500">Error: {(error as Error).message}</p>;

  return <div>Dashboard for: {data?.data.title}</div>;
};
