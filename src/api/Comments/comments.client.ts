import { apiRequest } from '@/api/Api';
import {
  CommentInput,
  NoteCommentResponse,
  UpdateCommentInput,
} from '@/api/Comments/comments.types';
import { DeleteResponse } from '@/types/DeleteResponse';

export const getAllCommentsForNote = async (noteId: string) =>
  apiRequest<undefined, NoteCommentResponse[]>({
    method: 'GET',
    url: 'comments',
    params: { noteId },
  });

export const createNewComment = async (data: CommentInput) => {
  apiRequest<CommentInput, NoteCommentResponse[]>({
    method: 'POST',
    url: 'comments',
    data,
  });
};

export const updateComment = async ({
  commentId,
  content,
}: UpdateCommentInput) => {
  apiRequest<{ content: string }, NoteCommentResponse[]>({
    method: 'PATCH',
    url: `comments/${commentId}`,
    data: { content },
  });
};

export const deleteComment = async (commentId: string) => {
  apiRequest<undefined, DeleteResponse>({
    method: 'DELETE',
    url: `comments/${commentId}`,
  });
};
