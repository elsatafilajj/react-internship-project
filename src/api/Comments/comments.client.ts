import { apiRequest } from '@/api/Api';
import {
  CommentInput,
  CommentsResponse,
  UpdateCommentInput,
} from '@/api/Comments/comments.types';
import { DeleteResponse } from '@/types/DeleteResponse';

export const getAllCommentsForNote = async (noteId: string) =>
  apiRequest<undefined, CommentsResponse[]>({
    method: 'GET',
    url: `comments?noteId=${noteId}`,
  });

export const createNewComment = async (data: CommentInput) => {
  apiRequest<CommentInput, CommentsResponse[]>({
    method: 'POST',
    url: '/comments',
    data,
  });
};

export const updateComment = async ({
  commentId,
  content,
}: UpdateCommentInput) => {
  apiRequest<{ content: string }, CommentsResponse[]>({
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
