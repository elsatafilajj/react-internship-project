import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { getAllUsersInRoom } from '@/api/User/user.client';
import { User } from '@/api/User/user.types';
import { queryKeys } from '@/constants/queryKeys';

export const useGetAllUsersByRoomQuery = (
  roomId: string,
  options?: UseQueryOptions<AxiosResponse<User[]>>,
) => {
  return useQuery<AxiosResponse<User[]>>({
    queryKey: queryKeys.getUsers(),
    queryFn: () => getAllUsersInRoom(roomId),
    ...options,
  });
};
