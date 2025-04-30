import { GetUsersParams } from '@/api/Users/users.types';

export const queryKeys = {
  getUsers: (params: GetUsersParams) => ['users', params],
  getSingleUser: (id: string) => ['user', id],
};
