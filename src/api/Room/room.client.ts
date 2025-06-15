import { apiRequest } from '@/api/Api';
import { DeleteResponse } from '@/types/DeleteResponse';

import {
  Room,
  CreateRoomInput,
  UpdateRoomInput,
  RoomWithRole,
  InviteRoomCodeRepsonse,
  RoomJoinedResponse,
} from './room.types';

export const getAllRooms = async () =>
  apiRequest<undefined, RoomWithRole[]>({
    method: 'GET',
    url: 'rooms',
  });

export const getAllArchivedRooms = async () =>
  apiRequest<undefined, RoomWithRole[]>({
    method: 'GET',
    url: 'rooms/archived',
  });

export const getRoomById = async (roomId: string) =>
  apiRequest<undefined, Room>({
    method: 'GET',
    url: `rooms/${roomId}`,
  });

export const createRoom = async (data: CreateRoomInput) =>
  apiRequest<CreateRoomInput, Room>({
    method: 'POST',
    url: 'rooms',
    data,
  });

export const updateRoom = async (roomId: string, data: UpdateRoomInput) =>
  apiRequest<UpdateRoomInput, Room>({
    method: 'PATCH',
    url: `rooms/${roomId}`,
    data,
  });

export const deleteRoom = async (roomId: string) =>
  apiRequest<undefined, DeleteResponse>({
    method: 'DELETE',
    url: `rooms/${roomId}`,
  });

export const removeUserFromRoom = async (roomId: string, userId: string) =>
  apiRequest<undefined, DeleteResponse>({
    method: 'POST',
    url: `rooms/${roomId}/remove`,
    params: { userId },
  });

export const getInviteCodeForRoom = async (roomId: string) =>
  apiRequest<undefined, InviteRoomCodeRepsonse>({
    method: 'POST',
    url: `rooms/${roomId}/invite`,
  });

export const joinRoom = async (code: string) =>
  apiRequest<undefined, RoomJoinedResponse>({
    method: 'POST',
    url: `rooms/join/${code}`,
  });

export const leaveRoom = async (roomId: string) =>
  apiRequest<undefined, Room>({
    method: 'POST',
    url: `rooms/leave/${roomId}`,
  });
