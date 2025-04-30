import { userManagementTableData } from '@/mock/userManagementTable';
import { PaginatedResponse } from '@/types/PaginatedResponse';

import { CompanyUser, GetUsersParams } from './users.types';

export const getAllUsers = async (
  params: GetUsersParams = { page: 1, pageSize: 5 },
): Promise<PaginatedResponse<CompanyUser[]>> => {
  await new Promise((resolve) => setTimeout(resolve, 1_000));

  const { page = 1, pageSize = 10 } = params;
  const start = (page - 1) * pageSize;
  const paginatedUsers = userManagementTableData.slice(start, start + pageSize);

  const total = userManagementTableData.length;
  const lastPage = Math.ceil(total / pageSize);

  return {
    currentPage: page,
    lastPage,
    perPage: pageSize,
    total,
    data: paginatedUsers,
  };
};

// GET single user
export const getSingleUser = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1_000));

  const user = userManagementTableData.find((user) => Number(id) === user.id);

  return user || null;
};

// POST user
export const addUser = async (newUser: CompanyUser): Promise<CompanyUser> => {
  await new Promise((resolve) => setTimeout(resolve, 1_000));

  newUser.id = userManagementTableData.length + 1; // Simulate ID generation
  userManagementTableData.push(newUser);
  return newUser;
};

// PUT user
export const editUser = async ({
  id,
  updatedUser,
}: {
  id: number;
  updatedUser: Partial<CompanyUser>;
}): Promise<CompanyUser | null> => {
  await new Promise((resolve) => setTimeout(resolve, 1_000));

  const userIndex = userManagementTableData.findIndex((user) => user.id === id);
  if (userIndex === -1) return null;

  const updatedUserData = {
    ...userManagementTableData[userIndex],
    ...updatedUser,
  };
  userManagementTableData[userIndex] = updatedUserData;
  return updatedUserData;
};

// DELETE user
export const deleteUser = async (id: number) => {
  await new Promise((resolve) => setTimeout(resolve, 1_000));

  const userIndex = userManagementTableData.findIndex((user) => user.id === id);
  if (userIndex === -1) return false;

  userManagementTableData.splice(userIndex, 1);
  return true;
};
