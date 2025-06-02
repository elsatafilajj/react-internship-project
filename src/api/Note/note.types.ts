import { Room } from '@/api/Room/room.types';
import { User } from '@/api/User/user.types';
import { RoomType } from '@/api/Users/users.types';

enum Color {
  green = 'note-background-green',
  yellow = 'note-background-yellow',
  pink = 'note-background-pink',
  blue = 'note-background-blue',
  red = 'note-background-red',
}

export interface NoteItem {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  room: Room;
  author: User;
  content: string;
  totalVotes: number;
  color: Color;
  xAxis: number;
  yAxis: number;
  noteVotes: { user: User }[];
}

export interface CreateNoteInput {
  roomId: RoomType['uuid'];
  content?: string;
  xAxis: number;
  yAxis: number;
}

export interface UpdateNoteInput {
  content?: string;
  color?: Color;
  xAxis?: number;
  yAxis?: number;
}
