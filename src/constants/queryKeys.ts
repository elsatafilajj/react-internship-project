export const queryKeys = {
  getUsers: () => ['users'],
  getSingleUser: (id: string) => ['user', id],

  getRooms: () => ['rooms'],
  getSingleRoom: (id: string) => ['room', id],
  getArchivedRooms: () => ['archivedRooms'],
  getRoomHost: (id: string) => ['rooms', id, 'host'],

  getNotesByRoomId: (roomId: string) => ['notes', roomId],
  getSingleNote: (noteId: string, roomId: string) => ['note', noteId, roomId],

  getCommentsByNoteId: (noteId: string) => ['comments', noteId],

  getActivitiesForRoom: (roomId: string) => ['activities', roomId],
};
