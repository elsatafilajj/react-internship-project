export const queryKeys = {
  getUsers: () => ['users'],
  getSingleUser: (id: string) => ['user', id],

  getRooms: () => ['rooms'],
  getSingleRoom: (id: string) => ['room', id],
  getArchivedRooms: () => ['archivedRooms'],

  getNotesByRoomId: (
    roomId: string,
    xMin: number | undefined,
    yMin: number | undefined,
    xMax: number | undefined,
    yMax: number | undefined,
  ) => ['notes', roomId, xMin, yMin, xMax, yMax],
  getSingleNote: (noteId: string, roomId: string) => ['note', noteId, roomId],

  getCommentsByNoteId: (noteId: string) => ['comments', noteId],

  getActivitiesForRoom: (roomId: string) => ['activities', roomId],
};
