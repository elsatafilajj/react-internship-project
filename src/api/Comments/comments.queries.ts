import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { getAllCommentsForNote } from '@/api/Comments/comments.client';
import { NoteComment } from '@/api/Comments/comments.types';
import { queryKeys } from '@/constants/queryKeys';

export const useGetAllCommentsQuery = (
  noteId: string,
  options?: UseQueryOptions<AxiosResponse<NoteComment[]>>,
) => {
  return useQuery<AxiosResponse<NoteComment[]>>({
    queryKey: queryKeys.getCommentsByNoteId(noteId),
    queryFn: () => getAllCommentsForNote(noteId),
    enabled: !!noteId,
    ...options,
  });
};
