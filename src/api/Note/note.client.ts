import { apiRequest } from '@/api/Api';
import {
  NoteItem,
  CreateNoteInput,
  UpdateNoteInput,
  ExportNotesInput,
  NoteVotesResponse,
} from '@/api/Note/note.types';
import { DeleteResponse } from '@/types/DeleteResponse';

interface AddVoteResponse {
  success: boolean;
  message: string;
  voteSwitched: boolean;
}

export const getAllNotesFromRoom = async (roomId: string) =>
  apiRequest<undefined, NoteItem[]>({
    url: 'notes',
    method: 'GET',
    params: { roomId },
  });

export const createNewNote = async (input: CreateNoteInput) =>
  apiRequest<CreateNoteInput, NoteItem[]>({
    url: 'notes',
    method: 'POST',
    data: input,
  });

export const updateNote = async (noteId: string, data: UpdateNoteInput) =>
  apiRequest<UpdateNoteInput, NoteItem[]>({
    url: `notes/${noteId}`,
    method: 'PATCH',
    data,
  });

export const deleteNote = async (noteId: string) =>
  apiRequest<undefined, DeleteResponse>({
    url: `notes/${noteId}`,
    method: 'DELETE',
  });

export const addVoteToNote = async (noteId: NoteItem['uuid']) =>
  apiRequest<undefined, AddVoteResponse>({
    url: `notes/${noteId}/vote`,
    method: 'POST',
  });

export const removeVoteFromNote = async (noteId: NoteItem['uuid']) =>
  apiRequest({ url: `notes/${noteId}/vote`, method: 'DELETE' });

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
