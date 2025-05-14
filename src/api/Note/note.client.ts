import { apiRequest } from '@/api/Api';
import {
  NoteItem,
  CreateNoteInput,
  UpdateNoteInput,
} from '@/api/Note/note.types';
import { DeleteResponse } from '@/components/shared/interfaces/DeleteResponse';

export async function GetAllNotesFromRoom(roomId: string) {
  const response = await apiRequest<undefined, NoteItem[]>({
    url: `notes/${roomId}`,
    method: 'GET',
  });
  return response.data;
}

export async function CreateNewNote(input: CreateNoteInput) {
  const response = await apiRequest<CreateNoteInput, NoteItem>({
    url: 'notes',
    method: 'POST',
    data: input,
  });
  return response.data;
}

export async function updateNote(noteId: string, input: UpdateNoteInput) {
  const response = await apiRequest<UpdateNoteInput, NoteItem>({
    url: `notes/${noteId}`,
    method: 'PATCH',
    data: input,
  });
  return response.data;
}

export async function deleteNote(noteId: string) {
  const response = await apiRequest<undefined, DeleteResponse>({
    url: `notes/${noteId}`,
    method: 'DELETE',
  });
  return response.data;
}

export async function addVoteToNote(noteId: string) {
  const response = await apiRequest<undefined, boolean>({
    url: `notes/${noteId}/vote`,
    method: 'POST',
  });
  return response.data;
}

export async function removeVoteFromNote(noteId: string) {
  const response = await apiRequest<undefined, boolean>({
    url: `notes/${noteId}/vote`,
    method: 'DELETE',
  });
  return response.data;
}
