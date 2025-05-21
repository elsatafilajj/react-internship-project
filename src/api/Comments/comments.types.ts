import { Note } from '@/api/Room/room.types';
import { User } from '@/api/User/user.types';

export interface NoteComment {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  content: string;
  user: User;
  parent?: Note | null;
}

export interface CommentInput {
  noteId: string;
  content: string;
  parentId?: string;
}

export interface UpdateCommentInput {
  commentId: string;
  content: string;
}
