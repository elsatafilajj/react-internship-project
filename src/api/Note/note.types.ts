import { Room } from '@/api/Room/room.types';
import { User } from '@/api/User/user.types';

type NoteColor =
  | 'note-background-green'
  | 'note-background-yellow'
  | 'note-background-pink'
  | 'note-background-blue'
  | 'note-background-red'
  | string;

export interface NoteItem {
  uuid: string;
  content: string;
  totalVotes: number;
  color: NoteColor;
  xAxis: number;
  yAxis: number;
  firstName: User['firstName'];
  lastName: User['lastName'];
}

export interface CreateNoteInput {
  roomId: Room['uuid'];
  content?: string;
  xAxis: number;
  yAxis: number;
}

export interface UpdateNoteInput {
  content?: string;
  color?: NoteColor;
  xAxis?: number;
  yAxis?: number;
}

export interface ExportNotesInput {
  roomId: Room['uuid'];
  fileType: 'json' | 'csv' | 'pdf';
}

export type NoteVotesResponse = Pick<User, 'uuid' | 'firstName' | 'lastName'>;

export interface AddVoteResponse {
  success: boolean;
  message: string;
  voteSwitched: boolean;
}

export interface WinnerNoteResponse {
  uuid: string;
}
