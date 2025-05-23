import { Room } from '@/api/Room/room.types';
import { User } from '@/api/User/user.types';
import { RoomType } from '@/api/Users/users.types';

export interface NoteItem {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  room: Room;
  author: User;
  content: string;
  totalVotes: number;
  xAxis: number;
  yAxis: number;
}

export interface CreateNoteInput {
  roomId: RoomType['uuid'];
  content?: string;
  xAxis: number;
  yAxis: number;
}

export interface UpdateNoteInput {
  content?: string;
  xAxis?: number;
  yAxis?: number;
}
