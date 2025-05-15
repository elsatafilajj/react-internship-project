import { apiRequest } from '@/api/Api';
import {
  NoteList,
  NoteItem,
  CreateNoteInput,
  UpdateNoteInput,
  AddVoteToNote,
} from '@/api/Note/note.types';
import { DeleteResponse } from '@/components/shared/interfaces/delete-response.interface';

export async function GetAllNotesFromRoom(roomId: string): Promise<NoteList> {
  const response = await apiRequest<undefined, NoteList>({
    url: `notes/${roomId}`,
    method: 'GET',
  });
  return response.data;
}

export async function CreateNewNote(input: CreateNoteInput): Promise<NoteItem> {
  const response = await apiRequest<CreateNoteInput, NoteItem>({
    url: 'notes',
    method: 'POST',
    data: input,
  });
  return response.data;
}

export async function updateNote(
  noteId: string,
  input: UpdateNoteInput,
): Promise<NoteItem> {
  const response = await apiRequest<UpdateNoteInput, NoteItem>({
    url: `notes/${noteId}`,
    method: 'PATCH',
    data: input,
  });
  return response.data;
}

export async function deleteNote(noteId: string): Promise<DeleteResponse> {
  const response = await apiRequest<undefined, DeleteResponse>({
    url: `notes/${noteId}`,
    method: 'DELETE',
  });
  return response.data;
}

export async function addVoteToNote(noteId: string): Promise<AddVoteToNote> {
  const response = await apiRequest<undefined, AddVoteToNote>({
    url: `notes/${noteId}/vote`,
    method: 'POST',
  });
  return response.data;
}

export async function removeVoteFromNote(noteId: string): Promise<boolean> {
  const response = await apiRequest<undefined, boolean>({
    url: `notes/${noteId}/vote`,
    method: 'DELETE',
  });
  return response.data;
}
