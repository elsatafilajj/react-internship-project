enum Namespaces {
  ROOMS = 'rooms',
  NOTES = 'notes',
  COMMENTS = 'comments',
  ACTIVITIES = 'activities',
}

enum Actions {
  JOIN = 'join',
  LEAVE = 'leave',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

enum Listeners {
  JOINED = 'joined',
  LEFT = 'left',
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
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
}
