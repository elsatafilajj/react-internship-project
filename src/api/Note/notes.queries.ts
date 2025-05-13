import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { GetAllNotesFromRoom } from '@/api/Note/note.client';
import { NoteList, NoteItem } from '@/api/Note/note.types';
import { queryKeys } from '@/constants/queryKeys';

export const useGetAllNotesFromRoomQuery = (
  roomId: string,
  options?: UseQueryOptions<NoteList>,
) => {
  return useQuery<NoteList>({
    queryKey: queryKeys.getNotesByRoomId(roomId),
    queryFn: () => GetAllNotesFromRoom(roomId),
    enabled: !!roomId,
    ...options,
  });
};

export const useGetNoteByIdQuery = (
  noteId: string,
  options?: UseQueryOptions<NoteItem>,
) => {
  return useQuery<NoteItem>({
    queryKey: queryKeys.getSingleNote(noteId),
    queryFn: async () => {
      const allNotes = await GetAllNotesFromRoom('');
      return allNotes.find((note) => note.uuid === noteId)!;
    },
    enabled: !!noteId,
    ...options,
  });
};
