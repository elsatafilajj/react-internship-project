export type NoteList = NoteItem[];
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

export interface Room {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  slug: string;
  isActive: string;
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

export interface AddVoteToNoteInput {
  noteId: string;
}

export interface RemoveVoteFromNoteInput {
  noteId: string;
}

export type AddVoteToNote = boolean;
