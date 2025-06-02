import { apiRequest } from '@/api/Api';
import {
  NoteItem,
  CreateNoteInput,
  UpdateNoteInput,
} from '@/api/Note/note.types';
import { DeleteResponse } from '@/types/DeleteResponse';

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
  apiRequest({ url: `notes/${noteId}/vote`, method: 'POST' });

export const removeVoteFromNote = async (noteId: NoteItem['uuid']) =>
  apiRequest({ url: `notes/${noteId}/vote`, method: 'DELETE' });
