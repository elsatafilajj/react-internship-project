import { apiRequest } from '@/api/Api';
import { DeleteResponse } from '@/types/interfaces/DeleteResponse';

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
  return response;
};

export const getRoomById = async (roomId: string) => {
  const response = await apiRequest<undefined, Room>({
    method: 'GET',
    url: `rooms/${roomId}`,
  });
  return response;
};

export const createRoom = async (data: CreateRoomInput) => {
  const response = await apiRequest<CreateRoomInput, Room>({
    method: 'POST',
    url: 'rooms',
    data,
  });
  return response;
};

export const updateRoom = async (roomId: string, data: UpdateRoomInput) => {
  const response = await apiRequest<UpdateRoomInput, Room>({
    method: 'PATCH',
    url: `rooms/${roomId}`,
    data,
  });
  return response;
};

export const removeUserFromRoom = async (roomId: string, userId: string) => {
  const response = await apiRequest<undefined, DeleteResponse>({
    method: 'DELETE',
    url: `rooms/remove-user/${roomId}/${userId}`,
  });
  return response;
};

export const joinRoom = async (roomId: string) => {
  const response = await apiRequest<undefined, Room>({
    method: 'POST',
    url: `rooms/join/${roomId}`,
  });
  return response;
};

export const leaveRoom = async (roomId: string) => {
  const response = await apiRequest<undefined, Room>({
    method: 'POST',
    url: `rooms/leave/${roomId}`,
  });
  return response;
};
