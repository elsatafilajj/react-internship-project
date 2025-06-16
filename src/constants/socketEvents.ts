enum Namespaces {
  ROOMS = 'rooms',
  NOTES = 'notes',
  COMMENTS = 'comments',
  ACTIVITIES = 'activity',
}

enum Actions {
  JOIN = 'join',
  LEAVE = 'leave',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  VOTE = 'vote',
  REMOVE_VOTE = 'removeVote',
  ARCHIVE = 'archive',
  LEAVEP = 'leaveP',
  REMOVE = 'remove',
}

enum Listeners {
  JOINED = 'joined',
  LEFT = 'left',
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  VOTED = 'voted',
  REMOVED = 'removed',
  ARCHIVED = 'archived',
  LEFTP = 'leftP',
}

export enum socketEvents {
  JoinRoom = `${Namespaces.ROOMS}/${Actions.JOIN}`,
  JoinedRoom = `${Namespaces.ROOMS}/${Listeners.JOINED}`,

  LeaveRoom = `${Namespaces.ROOMS}/${Actions.LEAVE}`,
  LeftRoom = `${Namespaces.ROOMS}/${Listeners.LEFT}`,

  CreateNote = `${Namespaces.NOTES}/${Actions.CREATE}`,
  CreatedNote = `${Namespaces.NOTES}/${Listeners.CREATED}`,

  UpdateNote = `${Namespaces.NOTES}/${Actions.UPDATE}`,
  UpdatedNote = `${Namespaces.NOTES}/${Listeners.UPDATED}`,

  DeleteNote = `${Namespaces.NOTES}/${Actions.DELETE}`,
  DeletedNote = `${Namespaces.NOTES}/${Listeners.DELETED}`,

  CreateComment = `${Namespaces.COMMENTS}/${Actions.CREATE}`,
  CreatedComment = `${Namespaces.COMMENTS}/${Listeners.CREATED}`,

  UpdateComment = `${Namespaces.COMMENTS}/${Actions.UPDATE}`,
  UpdatedComment = `${Namespaces.COMMENTS}/${Listeners.UPDATED}`,

  DeleteComment = `${Namespaces.COMMENTS}/${Actions.DELETE}`,
  DeletedComment = `${Namespaces.COMMENTS}/${Listeners.DELETED}`,

  AddVote = `${Namespaces.NOTES}/${Actions.VOTE}`,
  AddedVote = `${Namespaces.NOTES}/${Listeners.VOTED}`,

  RemoveVote = `${Namespaces.NOTES}/${Actions.REMOVE_VOTE}`,
  RemovedVote = `${Namespaces.NOTES}/${Listeners.REMOVED}`,

  NewActivity = `${Namespaces.ACTIVITIES}`,

  ArchiveRoom = `${Namespaces.ROOMS}/${Actions.ARCHIVE}`,
  ArchivedRoom = `${Namespaces.ROOMS}/${Listeners.ARCHIVED}`,

  UserRemove = `${Namespaces.ROOMS}/${Listeners.REMOVED}`,

  RoomLeaveP = `${Namespaces.ROOMS}/${Actions.LEAVEP}`,
  RoomLeftP = `${Namespaces.ROOMS}/${Listeners.LEFTP}`,

  UserJoined = `${Namespaces.ROOMS}/${Listeners.JOINED}`,

  RemoveUser = `${Namespaces.ROOMS}/${Actions.REMOVE}`,
}
