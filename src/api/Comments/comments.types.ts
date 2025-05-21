export type Comments = CommentsResponse[];

export interface CommentsResponse {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  content: string;
  user: User;
  parent?: Parent | null;
}

export interface CommentInput {
  noteId: string;
  content: string;
  parentId?: string;
}

export interface User {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Parent {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  content: string;
}

export interface UpdateCommentInput {
  commentId: string;
  content: string;
}
