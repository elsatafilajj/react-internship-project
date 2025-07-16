import { apiRequest } from '@/api/Api';
import {
  NoteItem,
  ExportNotesInput,
  NoteVotesResponse,
  WinnerNoteResponse,
} from '@/api/Note/note.types';
import { Room } from '@/api/Room/room.types';

export const getAllNoteIdsFromRoom = async (
  roomId: string,
  xMin: number,
  yMin: number,
  xMax: number,
  yMax: number,
) =>
  apiRequest<undefined, Pick<NoteItem, 'uuid' | 'xAxis' | 'yAxis'>[]>({
    url: 'notes/viewport',
    method: 'GET',
    params: { roomId, xMin, yMin, xMax, yMax },
  });

export const getSingleNoteById = async (noteId: string) =>
  apiRequest<undefined, NoteItem>({
    url: `notes/${noteId}`,
    method: 'GET',
  });

export const getNoteVotes = async (noteId: NoteItem['uuid']) =>
  apiRequest<undefined, NoteVotesResponse[]>({
    url: `notes/votes`,
    method: 'GET',
    params: { noteId },
  });

export const exportNotes = async ({ roomId, fileType }: ExportNotesInput) =>
  apiRequest<undefined>({
    url: 'notes/export',
    method: 'GET',
    params: { roomId, fileType },
    responseType: 'blob',
  });

export const getWinnerNotes = async (roomId: Room['uuid']) =>
  apiRequest<undefined, WinnerNoteResponse[]>({
    url: `notes/room/${roomId}/current-winner`,
    method: 'GET',
  });
