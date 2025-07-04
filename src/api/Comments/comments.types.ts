import { User } from '@/api/User/user.types';

export interface NoteCommentResponse {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  content: string;
  user: User;
  parent?: Comment | null;
}
export interface Comment {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  content: string;
}
