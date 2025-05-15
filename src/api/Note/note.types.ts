import { Room } from '@/api/Room/room.types';

export interface NoteItem {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  room: Room;
  author: Author;
  content: string;
  totalVotes: number;
  xAxis: number;
  yAxis: number;
}

export interface Author {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  firstName: string;
  lastName: string;
  email: string;
}

export interface CreateNoteInput {
  roomId: string;
  content?: string;
  xAxis: number;
  yAxis: number;
}

export interface UpdateNoteInput {
  roomId: string;
  content?: string;
  xAxis?: number;
  yAxis?: number;
}
