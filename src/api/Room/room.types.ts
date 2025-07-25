import { ResourceType } from '@/api/Activities/activitites.types';
import { User } from '@/api/User/user.types';

export interface RoomWithRole {
  room: Room;
  role: string;
}

export interface Room {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  slug: string;
  isActive: boolean;
  user: User[];
  note: Note[];
}

export interface InviteRoomCodeRepsonse {
  inviteCode: string;
}

export interface RoomJoinedResponse {
  room: Room;
  user: User;
  role: string;
  joined_at: string;
}

export interface Note {
  uuid: string;
  content: string;
  totalVotes: number;
  xAxis: number;
  yAxis: number;
  created_at: string;
  updated_at: string;
}

export interface CreateRoomInput {
  title: string;
}

export interface LeaveRoomResponse {
  success: boolean;
  message: string;
  resourceType: ResourceType;
  resourceId: string;
  timestamp: string;
}

export interface UpdateRoomInput {
  title?: string;
  isActive?: boolean;
}
