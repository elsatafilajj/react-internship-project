import { useParams } from 'react-router-dom';

import { useGetRoomByIdQuery } from '@/api/Room/room.queries';

export const useRoomStatus = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { data, isFetched } = useGetRoomByIdQuery(roomId || '');
  const isRoomArchived = isFetched && data?.data?.isActive === false;
  return { isRoomArchived, isFetched };
};
