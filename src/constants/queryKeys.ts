import { NoteItem } from '@/api/Note/note.types';

export const queryKeys = {
  getUsers: () => ['users'],
  getSingleUser: (userId: string) => ['users', userId],

  getRooms: () => ['rooms'],
  getSingleRoom: (id: string) => ['rooms', id],
  getArchivedRooms: () => ['archivedRooms'],
  getActivitiesForRoom: (roomId: string) => ['activities', roomId],

  getNoteIdsByRoomId: (
    roomId: string,
    xMin: number | undefined,
    yMin: number | undefined,
    xMax: number | undefined,
    yMax: number | undefined,
  ) => ['notes', roomId, xMin, yMin, xMax, yMax],

  getSingleNote: (noteId: string) => ['notes', noteId],
  getNoteVotes: (noteId: NoteItem['uuid']) => ['notes', noteId, 'votes'],
  getCommentsByNoteId: (noteId: string) => ['notes', noteId, 'comments'],
};
