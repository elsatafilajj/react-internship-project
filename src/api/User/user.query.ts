import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { getAllUsersInRoom } from '@/api/User/user.client';
import { UserInRoom } from '@/api/User/user.types';
import { queryKeys } from '@/constants/queryKeys';

export const useGetAllUsersByRoomQuery = (
  roomId: string,
  options?: UseQueryOptions<AxiosResponse<UserInRoom[]>>,
) => {
  return useQuery<AxiosResponse<UserInRoom[]>>({
    queryKey: queryKeys.getUsers(),
    queryFn: () => getAllUsersInRoom(roomId),
    ...options,
  });
};
