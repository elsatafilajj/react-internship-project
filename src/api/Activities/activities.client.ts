import { ActivityResponse } from '@/api/Activities/activitites.types';
import { apiRequest } from '@/api/Api';

export const getAllActivitiesForRoom = async (roomId: string) =>
  apiRequest<undefined, ActivityResponse[]>({
    method: 'GET',
    url: `notes/${roomId}`,
  });
