import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import {
  getAllArchivedRooms,
  getAllRooms,
  getRoomById,
} from '@/api/Room/room.client';
import { Room, RoomWithRole } from '@/api/Room/room.types';
import { queryKeys } from '@/constants/queryKeys';

export const useGetAllRoomsQuery = (
  options?: UseQueryOptions<AxiosResponse<RoomWithRole[]>>,
) => {
  return useQuery<AxiosResponse<RoomWithRole[]>>({
    queryKey: queryKeys.getRooms(),
    queryFn: getAllRooms,
    ...options,
  });
};

export const useGetRoomByIdQuery = (
  roomId: string,

  options?: UseQueryOptions<AxiosResponse<Room>>,
) => {
  const uuidRegex = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/); 
  return useQuery<AxiosResponse<Room>>({
    queryKey: queryKeys.getSingleRoom(roomId),
    queryFn: () => getRoomById(roomId),
    enabled: !!roomId && uuidRegex.test(roomId),
    ...options,
  });
};

export const useGetAllArchivedRoomsQuery = (
  options?: UseQueryOptions<AxiosResponse<RoomWithRole[]>>,
) => {
  return useQuery<AxiosResponse<RoomWithRole[]>>({
    queryKey: queryKeys.getArchivedRooms(),
    queryFn: getAllArchivedRooms,
    ...options,
  });
};
