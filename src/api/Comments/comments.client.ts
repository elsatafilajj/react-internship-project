import { apiRequest } from '@/api/Api';
import { NoteCommentResponse } from '@/api/Comments/comments.types';

export const getAllCommentsForNote = async (noteId: string) =>
  apiRequest<undefined, NoteCommentResponse[]>({
    method: 'GET',
    url: 'comments',
    params: { noteId },
  });
