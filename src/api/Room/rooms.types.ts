export interface Room {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomInput {
  name: string;
  description: string;
}

export interface UpdateRoomInput {
  name: string;
  description: string;
}
