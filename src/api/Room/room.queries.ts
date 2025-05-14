import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getAllRooms, getRoomById } from '@/api/Room/room.client';
import { Room, RoomWithRole } from '@/api/Room/room.types';
import { queryKeys } from '@/constants/queryKeys';

export const useGetAllRoomsQuery = (
  options?: UseQueryOptions<RoomWithRole[]>,
) => {
  return useQuery<RoomWithRole[]>({
    queryKey: queryKeys.getRooms(),
    queryFn: getAllRooms,
    ...options,
  });
};

export const useGetRoomByIdQuery = (
  roomId: string,
  options?: UseQueryOptions<Room>,
) => {
  return useQuery<Room>({
    queryKey: queryKeys.getSingleRoom(roomId),
    queryFn: () => getRoomById(roomId),
    enabled: !!roomId,
    ...options,
  });
};
