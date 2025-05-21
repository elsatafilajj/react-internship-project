import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { getAllCommentsForNote } from '@/api/Comments/comments.client';
import { CommentsResponse } from '@/api/Comments/comments.types';
import { queryKeys } from '@/constants/queryKeys';

export const useGetAllCommentsQuery = (
  noteId: string,
  options?: UseQueryOptions<AxiosResponse<CommentsResponse[]>>,
) => {
  return useQuery<AxiosResponse<CommentsResponse[]>>({
    queryKey: queryKeys.getCommentsByNoteId(noteId),
    queryFn: () => getAllCommentsForNote(noteId),
    enabled: !!noteId,
    ...options,
  });
};
