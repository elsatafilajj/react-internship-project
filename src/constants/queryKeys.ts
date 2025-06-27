import { NoteItem } from '@/api/Note/note.types';
import { Room } from '@/api/Room/room.types';
import { User } from '@/api/User/user.types';

export const queryKeys = {
  getUsers: () => ['users'],
  getSingleUser: (userId: User['uuid']) => ['users', userId],

  getRooms: () => ['rooms'],
  getSingleRoom: (roomId: Room['uuid']) => ['rooms', roomId],
  getArchivedRooms: () => ['archivedRooms'],
  getActivitiesForRoom: (roomId: Room['uuid']) => ['activities', roomId],
  getWinnerNotes: (roomId: Room['uuid']) => ['rooms', 'currentWinner', roomId],

  getNoteIdsByRoomId: (
    roomId: Room['uuid'],
    xMin: number | undefined,
    yMin: number | undefined,
    xMax: number | undefined,
    yMax: number | undefined,
  ) => ['notes', roomId, xMin, yMin, xMax, yMax],

  getSingleNote: (noteId: NoteItem['uuid']) => ['notes', noteId],
  getNoteVotes: (noteId: NoteItem['uuid']) => ['notes', 'votes', noteId],
  getCommentsByNoteId: (noteId: NoteItem['uuid']) => [
    'notes',
    'comments',
    noteId,
  ],
};
