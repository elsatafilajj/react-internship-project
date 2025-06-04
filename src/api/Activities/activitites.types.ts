import { Room } from '@/api/Room/room.types';
import { User } from '@/api/User/user.types';

export enum ActivityType {
  'create',
  'update',
  'delete',
}

export enum ResourceType {
  'user',
  'room',
  'note',
  'comment',
  'vote',
}

export interface ActivityResponse {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  activityType: ActivityType;
  resourceType: ResourceType;
  room: Room;
  user: User;
}
