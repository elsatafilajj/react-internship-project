import { Room } from '@/api/Room/room.types';
import { User } from '@/api/User/user.types';

export enum ActivityType {
  Create,
  Update,
  Delete,
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
  resourceId: string;
  room: Room;
  user: User;
}
