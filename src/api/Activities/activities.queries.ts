import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { getAllActivitiesForRoom } from '@/api/Activities/activities.client';
import { ActivityResponse } from '@/api/Activities/activitites.types';
import { queryKeys } from '@/constants/queryKeys';

export const useGetAllActivitiesForRoom = (
  roomId: string,
  options?: UseQueryOptions<AxiosResponse<ActivityResponse[]>>,
) => {
  return useQuery<AxiosResponse<ActivityResponse[]>>({
    queryKey: queryKeys.getActivitiesForRoom(roomId),
    queryFn: () => getAllActivitiesForRoom(roomId),
    enabled: !!roomId,
    ...options,
  });
};
