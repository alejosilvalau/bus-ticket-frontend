export interface SeatType {
  id: number;
  name: string;
  upcharge: number;
}

export interface CreateSeatType {
  name: string;
  upcharge: number;
}

export interface UpdateSeatType {
  id: number;
  name?: string;
  upcharge?: number;
}

export interface SearchSeatType {
  name?: string;
  startUpcharge?: number;
  endUpcharge?: number;
}
