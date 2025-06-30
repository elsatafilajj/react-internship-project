import { NoteItem } from '@/api/Note/note.types';

export const queryKeys = {
  getUsers: () => ['users'],
  getSingleUser: (id: string) => ['user', id],

  getRooms: () => ['rooms'],
  getSingleRoom: (id: string) => ['room', id],
  getArchivedRooms: () => ['archivedRooms'],
  getRoomHost: (id: string) => ['rooms', id, 'host'],

  getNotesByRoomId: (roomId: string) => ['notes', roomId],
  getSingleNote: (noteId: string, roomId: string) => ['note', noteId, roomId],

  getNoteVotes: (noteId: NoteItem['uuid']) => ['notes', 'votes', noteId],

  getCommentsByNoteId: (noteId: string) => ['comments', noteId],

  getActivitiesForRoom: (roomId: string) => ['activities', roomId],
};
