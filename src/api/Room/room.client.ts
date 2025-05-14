import { apiRequest } from '@/api/Api';
import { DeleteResponse } from '@/components/shared/interfaces/DeleteResponse';

import {
  Room,
  CreateRoomInput,
  UpdateRoomInput,
  RoomWithRole,
} from './room.types';

export const getAllRooms = async () => {
  const response = await apiRequest<undefined, RoomWithRole[]>({
    method: 'GET',
    url: 'rooms',
  });
  return response.data;
};

export const getRoomById = async (roomId: string) => {
  const response = await apiRequest<undefined, Room>({
    method: 'GET',
    url: `rooms/${roomId}`,
  });
  return response.data;
};

export const createRoom = async (data: CreateRoomInput) => {
  const response = await apiRequest<CreateRoomInput, Room>({
    method: 'POST',
    url: 'rooms',
    data,
  });
  return response.data;
};

export const updateRoom = async (roomId: string, data: UpdateRoomInput) => {
  const response = await apiRequest<UpdateRoomInput, Room>({
    method: 'PATCH',
    url: `rooms/${roomId}`,
    data,
  });
  return response.data;
};

export const removeUserFromRoom = async (
  roomId: string,
  userId: string,
): Promise<DeleteResponse> => {
  const response = await apiRequest<undefined, DeleteResponse>({
    method: 'DELETE',
    url: `rooms/remove-user/${roomId}/${userId}`,
  });
  return response.data;
};

export const joinRoom = async (roomId: string) => {
  const response = await apiRequest<undefined, Room>({
    method: 'POST',
    url: `rooms/join/${roomId}`,
  });
  return response.data;
};

export const leaveRoom = async (roomId: string) => {
  const response = await apiRequest<undefined, Room>({
    method: 'POST',
    url: `rooms/leave/${roomId}`,
  });
  return response.data;
};
