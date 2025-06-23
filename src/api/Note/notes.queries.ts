import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useParams } from 'react-router-dom';
import { useTransformContext } from 'react-zoom-pan-pinch';

import {
  getAllNotesFromRoom,
  getNoteVotes,
  getSingleNoteById,
} from '@/api/Note/note.client';
import { NoteItem, NoteVotesResponse } from '@/api/Note/note.types';
import { queryKeys } from '@/constants/queryKeys';

export const useGetAllNotesFromRoomQuery = (
  roomId: string,
  xMin: number,
  yMin: number,
  xMax: number,
  yMax: number,
  options?: UseQueryOptions<AxiosResponse<NoteItem[]>>,
) => {
  const transformContext = useTransformContext();

  const uuidRegex =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

  return useQuery<AxiosResponse<NoteItem[]>>({
    queryKey: queryKeys.getNotesByRoomId(roomId, xMin, yMin, xMax, yMax),
    queryFn: () => {
      return getAllNotesFromRoom(roomId, xMin, yMin, xMax, yMax);
    },
    enabled:
      !!roomId &&
      uuidRegex.test(roomId) &&
      xMax > xMin &&
      yMax > yMin &&
      xMin >= 0 &&
      yMin >= 0 &&
      !!transformContext &&
      (options?.enabled ?? true),
    staleTime: 1000,
    ...options,
  });
};

export const useGetNoteByIdQuery = (
  uuid: string,
  options?: UseQueryOptions<AxiosResponse<NoteItem>>,
) => {
  const { roomId } = useParams<{ roomId: string }>();
  return useQuery<AxiosResponse<NoteItem>>({
    queryKey: queryKeys.getSingleNote(uuid, roomId || ''),
    queryFn: () => getSingleNoteById(uuid),
    enabled: !!roomId && !!uuid,
    ...options,
  });
};

export const useGetNoteVotesQuery = (
  noteId: NoteItem['uuid'],
  options?: UseQueryOptions<AxiosResponse<NoteVotesResponse[]>>,
) => {
  const uuidRegex = new RegExp(
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
  );
  const { roomId } = useParams<{ roomId: string }>();
  return useQuery<AxiosResponse<NoteVotesResponse[]>>({
    queryKey: queryKeys.getSingleNote(roomId || '', noteId),
    queryFn: () => getNoteVotes(noteId),
    enabled: !!roomId && uuidRegex.test(roomId),
    ...options,
  });
};
