import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { getAllCommentsForNote } from '@/api/Comments/comments.client';
import { NoteCommentResponse } from '@/api/Comments/comments.types';
import { queryKeys } from '@/constants/queryKeys';

export const useGetAllCommentsQuery = (
  noteId: string,
  options?: UseQueryOptions<AxiosResponse<NoteCommentResponse[]>>,
) => {
  return useQuery<AxiosResponse<NoteCommentResponse[]>>({
    queryKey: queryKeys.getCommentsByNoteId(noteId),
    queryFn: () => getAllCommentsForNote(noteId),
    enabled: !!noteId,
    ...options,
  });
};
