export interface PaginatedResponse<Data> {
  // TODO: delete this interface
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  data: Data;
}

export interface NewPaginatedResponse<Item> {
  // NOTE this is the new interface
  limit: number;
  total: number;
  lastKey?: string;
  items: Item[];
}
