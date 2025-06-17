export const queryKeys = {
  getUsers: () => ['users'],
  getSingleUser: (id: string) => ['user', id],

  getRooms: () => ['rooms'],
  getSingleRoom: (id: string) => ['room', id],
  getArchivedRooms: () => ['archivedRooms'],

  getNotesByRoomId: (roomId: string) => ['notes', roomId],
  getSingleNote: (roomId: string) => ['note', roomId],

  getCommentsByNoteId: (noteId: string) => ['comments', noteId],

  getActivitiesForRoom: (roomId: string) => ['activities', roomId],
};
