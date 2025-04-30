import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/constants/queryKeys';
import { PaginatedResponse } from '@/types/PaginatedResponse';

import { getAllUsers, getSingleUser } from './users.client';
import { CompanyUser, GetUsersParams } from './users.types';

export const useGetAllUsersQuery = (
  params: GetUsersParams = { page: 1, pageSize: 10 },
  options?: UseQueryOptions<PaginatedResponse<CompanyUser[]>>,
) => {
  return useQuery<PaginatedResponse<CompanyUser[]>>({
    queryKey: queryKeys.getUsers(params),
    queryFn: () => getAllUsers(params),
    ...options,
  });
};

export const useGetSingleUserQuery = (
  id: string,
  options?: UseQueryOptions<CompanyUser | null>,
) => {
  return useQuery<CompanyUser | null>({
    queryKey: queryKeys.getSingleUser(id),
    queryFn: () => getSingleUser(id),
    ...options,
  });
};
