import { apiRequest } from '@/api/Api';
import {
  NoteItem,
  CreateNoteInput,
  UpdateNoteInput,
  ExportNotesInput,
  AddVoteResponse,
  NoteVotesResponse,
  WinnerNoteResponse,
} from '@/api/Note/note.types';
import { Room } from '@/api/Room/room.types';
import { DeleteResponse } from '@/types/DeleteResponse';

export const getAllNotesFromRoom = async (
  roomId: string,
  xMin: number,
  yMin: number,
  xMax: number,
  yMax: number,
) =>
  apiRequest<undefined, NoteItem[]>({
    url: 'notes/viewport',
    method: 'GET',
    params: { roomId, xMin, yMin, xMax, yMax },
  });

export const getSingleNoteById = async (noteId: string) =>
  apiRequest<undefined, NoteItem>({
    url: `notes/${noteId}`,
    method: 'GET',
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

export const getWinnerNotes = async (roomId: Room['uuid']) =>
  apiRequest<undefined, WinnerNoteResponse[]>({
    url: `notes/room/${roomId}/current-winner`,
    method: 'GET',
  });
