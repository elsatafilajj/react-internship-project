import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { getAllUsersInRoom } from '@/api/User/user.client';
import { UserInRoom } from '@/api/User/user.types';
import { queryKeys } from '@/constants/queryKeys';
import { useHasEnteredRoom } from '@/hooks/useHasEnteredRoom';

export const useGetAllUsersByRoomQuery = (
  roomId: string,
  options?: UseQueryOptions<AxiosResponse<UserInRoom[]>>,
) => {
  const hasEnteredRoom = useHasEnteredRoom();
  const uuidRegex = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/); 
  return useQuery<AxiosResponse<UserInRoom[]>>({
    queryKey: queryKeys.getUsers(),
    queryFn: () => getAllUsersInRoom(roomId),
    enabled: hasEnteredRoom && !!roomId && uuidRegex.test(roomId),
    ...options,
  });
};
