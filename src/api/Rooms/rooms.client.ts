import { apiRequest } from '@/api/Api';
import {
  Room,
  CreateRoomInput,
  UpdateRoomInput,
} from '@/api/Rooms/rooms.types';

export const getAllRooms = async () => {
  return apiRequest<undefined, Room[]>({
    method: 'GET',
    url: 'rooms',
  });
};

export const getRoomById = async (roomId: string) => {
  return apiRequest<undefined, Room>({
    method: 'GET',
    url: `rooms/${roomId}`,
  });
};

export const createRoom = async (data: CreateRoomInput) => {
  return apiRequest<CreateRoomInput, Room>({
    method: 'POST',
    url: 'rooms',
    data,
  });
};

export const updateRoom = async (roomId: string, data: UpdateRoomInput) => {
  return apiRequest<UpdateRoomInput, Room>({
    method: 'PATCH',
    url: `rooms/${roomId}`,
    data,
  });
};

export const deleteRoom = async (roomId: string) => {
  return apiRequest<undefined, { success: boolean; message: string }>({
    method: 'DELETE',
    url: `rooms/${roomId}`,
  });
};

export const joinRoom = async (roomId: string) => {
  return apiRequest<undefined, Room>({
    method: 'POST',
    url: `rooms/join/${roomId}`,
  });
};

export const leaveRoom = async (roomId: string) => {
  return apiRequest<undefined, Room>({
    method: 'POST',
    url: `rooms/leave/${roomId}`,
  });
};

export const removeRoom = async (roomId: string) => {
  return apiRequest<undefined, Room>({
    method: 'DELETE',
    url: `rooms/remove/${roomId}`,
  });
};
