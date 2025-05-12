export interface Room {
  uuid: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomInput {
  title: string;
}

export interface UpdateRoomInput {
  title?: string;
  isActive?: boolean;
}
