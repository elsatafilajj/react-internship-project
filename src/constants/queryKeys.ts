export const queryKeys = {
  getUsers: () => ['users'],
  getSingleUser: (id: string) => ['user', id],

  getRooms: () => ['rooms'],
  getSingleRoom: (id: string) => ['room', id],

  getNotesByRoomId: (roomId: string) => ['notes', roomId],
  getSingleNote: (noteId: string, roomId: string) => ['note', noteId, roomId],

  getCommentsByNoteId: (noteId: string) => ['comments', noteId],

  getActivitiesForRoom: (roomId: string) => ['activities', roomId],
};
