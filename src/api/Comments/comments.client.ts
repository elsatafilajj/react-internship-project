import { apiRequest } from '@/api/Api';
import {
  CommentInput,
  NoteComment,
  UpdateCommentInput,
} from '@/api/Comments/comments.types';
import { DeleteResponse } from '@/types/DeleteResponse';

export const getAllCommentsForNote = async (noteId: string) =>
  apiRequest<undefined, NoteComment[]>({
    method: 'GET',
    url: 'comments',
    params: { noteId },
  });

export const createNewComment = async (data: CommentInput) => {
  apiRequest<CommentInput, NoteComment[]>({
    method: 'POST',
    url: '/comments',
    data,
  });
};

export const updateComment = async ({
  commentId,
  content,
}: UpdateCommentInput) => {
  apiRequest<{ content: string }, NoteComment[]>({
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
