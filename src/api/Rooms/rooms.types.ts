export interface Room {
  uuid: string;
  name?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateRoomInput {
  name: string;
  description: string;
}

export interface UpdateRoomInput {
  name: string;
  description: string;
}
