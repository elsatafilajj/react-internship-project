import { GetUsersParams } from '@/api/Users/users.types';

export const queryKeys = {
  getUsers: (params: GetUsersParams) => ['users', params],
  getSingleUser: (id: string) => ['user', id],

  getRooms: () => ['rooms'],
  getSingleRoom: (id: string) => ['room', id],
  getArchivedRooms: () => ['archivedRooms'],

  getNotesByRoomId: (roomId: string) => ['notes', roomId],
  getSingleNote: (noteId: string, roomId: string) => ['note', noteId, roomId],

  getCommentsByNoteId: (noteId: string) => ['comments', noteId],
};
