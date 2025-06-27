import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useParams } from 'react-router-dom';

import { getAllNotesFromRoom, getNoteVotes } from '@/api/Note/note.client';
import { NoteItem, NoteVotesResponse } from '@/api/Note/note.types';
import { queryKeys } from '@/constants/queryKeys';

const uuidRegex = new RegExp(
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
);
export const useGetAllNotesFromRoomQuery = (
  roomId: string,
  options?: UseQueryOptions<AxiosResponse<NoteItem[]>>,
) => {
  return useQuery<AxiosResponse<NoteItem[]>>({
    queryKey: queryKeys.getNotesByRoomId(roomId),
    queryFn: () => getAllNotesFromRoom(roomId),
    enabled: !!roomId && uuidRegex.test(roomId),
    ...options,
  });
};

export const useGetNoteByIdQuery = (
  roomId: string,
  noteId: string,
  options?: UseQueryOptions<AxiosResponse<NoteItem[]>>,
) => {
  return useQuery<AxiosResponse<NoteItem[]>>({
    queryKey: queryKeys.getSingleNote(roomId, noteId),
    queryFn: () => getAllNotesFromRoom(roomId),
    enabled: !!roomId && !!noteId,
    ...options,
  });
};

export const useGetNoteVotesQuery = (
  noteId: NoteItem['uuid'],
  options?: UseQueryOptions<AxiosResponse<NoteVotesResponse[]>>,
) => {
  const { roomId } = useParams<{ roomId: string }>();
  return useQuery<AxiosResponse<NoteVotesResponse[]>>({
    queryKey: queryKeys.getNoteVotes(noteId),
    queryFn: () => getNoteVotes(noteId),
    enabled: !!roomId && uuidRegex.test(roomId),
    ...options,
  });
};
