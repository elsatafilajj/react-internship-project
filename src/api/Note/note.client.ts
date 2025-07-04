import { apiRequest } from '@/api/Api';
import {
  NoteItem,
  ExportNotesInput,
  NoteVotesResponse,
} from '@/api/Note/note.types';

export const getAllNotesFromRoom = async (roomId: string) =>
  apiRequest<undefined, NoteItem[]>({
    url: 'notes',
    method: 'GET',
    params: { roomId },
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
