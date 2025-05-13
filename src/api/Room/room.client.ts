import { apiRequest } from '@/api/Api';

import {
  Room,
  CreateRoomInput,
  UpdateRoomInput,
  UserRoomList,
} from './room.types';

export const getAllRooms = async (): Promise<UserRoomList> => {
  const response = await apiRequest<undefined, UserRoomList>({
    method: 'GET',
    url: 'rooms',
  });
  return response.data;
};

export const getRoomById = async (roomId: string): Promise<Room> => {
  const response = await apiRequest<undefined, Room>({
    method: 'GET',
    url: `rooms/${roomId}`,
  });
  return response.data;
};

export const createRoom = async (data: CreateRoomInput): Promise<Room> => {
  const response = await apiRequest<CreateRoomInput, Room>({
    method: 'POST',
    url: 'rooms',
    data,
  });
  return response.data;
};

export const updateRoom = async (
  roomId: string,
  data: UpdateRoomInput,
): Promise<Room> => {
  const response = await apiRequest<UpdateRoomInput, Room>({
    method: 'PATCH',
    url: `rooms/${roomId}`,
    data,
  });
  return response.data;
};

export const deleteRoom = async (
  roomId: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await apiRequest<
    undefined,
    { success: boolean; message: string }
  >({
    method: 'DELETE',
    url: `rooms/${roomId}`,
  });
  return response.data;
};

export const joinRoom = async (roomId: string): Promise<Room> => {
  const response = await apiRequest<undefined, Room>({
    method: 'POST',
    url: `rooms/join/${roomId}`,
  });
  return response.data;
};

export const leaveRoom = async (roomId: string): Promise<Room> => {
  const response = await apiRequest<undefined, Room>({
    method: 'POST',
    url: `rooms/leave/${roomId}`,
  });
  return response.data;
};

export const removeRoom = async (roomId: string): Promise<Room> => {
  const response = await apiRequest<undefined, Room>({
    method: 'DELETE',
    url: `rooms/remove/${roomId}`,
  });
  return response.data;
};
