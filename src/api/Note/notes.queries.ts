import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useParams } from 'react-router-dom';
import { useTransformContext } from 'react-zoom-pan-pinch';

import {
  getAllNoteIdsFromRoom,
  getNoteVotes,
  getSingleNoteById,
  getWinnerNotes,
} from '@/api/Note/note.client';
import { WinnerNoteResponse } from '@/api/Note/note.types';
import { NoteItem, NoteVotesResponse } from '@/api/Note/note.types';
import { Room } from '@/api/Room/room.types';
import { queryKeys } from '@/constants/queryKeys';

const uuidRegex =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

export const useGetAllNoteIdsFromRoomQuery = (
  roomId: string,
  xMin: number,
  yMin: number,
  xMax: number,
  yMax: number,
  options?: UseQueryOptions<
    AxiosResponse<Pick<NoteItem, 'uuid' | 'xAxis' | 'yAxis'>[]>
  >,
) => {
  const transformContext = useTransformContext();

  return useQuery<AxiosResponse<Pick<NoteItem, 'uuid' | 'xAxis' | 'yAxis'>[]>>({
    queryKey: queryKeys.getNoteIdsByRoomId(roomId, xMin, yMin, xMax, yMax),
    queryFn: () => {
      return getAllNoteIdsFromRoom(roomId, xMin, yMin, xMax, yMax);
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
    ...options,
  });
};

export const useGetNoteByIdQuery = (
  uuid: string,
  options?: UseQueryOptions<AxiosResponse<NoteItem>>,
) => {
  const { roomId } = useParams<{ roomId: string }>();
  return useQuery<AxiosResponse<NoteItem>>({
    queryKey: queryKeys.getSingleNote(uuid),
    queryFn: () => getSingleNoteById(uuid),
    enabled: !!roomId && uuidRegex.test(roomId) && !!uuid,
    staleTime: 0,
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

export const useGetWinnerNotes = (
  roomId: Room['uuid'],
  options?: UseQueryOptions<AxiosResponse<WinnerNoteResponse[]>>,
) => {
  return useQuery<AxiosResponse<WinnerNoteResponse[]>>({
    queryKey: queryKeys.getWinnerNotes(roomId || ''),
    queryFn: () => getWinnerNotes(roomId || ''),
    enabled: !!roomId && uuidRegex.test(roomId),
    ...options,
  });
};
