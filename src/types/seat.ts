import type { Bus } from './bus';
import type { SeatType } from './seat-type';

export interface Seat {
  id: number;
  letter: string;
  number: number;
  isActive: boolean;
}

export interface SeatFull extends Seat {
  bus: Bus;
  seatType: SeatType;
}

export interface SeatAvailability {
  id: number;
  letter: string;
  number: number;
  isActive: boolean;
  seatTypeName: string;
  seatTypeUpcharge: number;
  isAvailable: boolean;
}

export interface CreateSeat {
  letter: string;
  number: number;
  isActive?: boolean;
  busId: number;
  seatTypeId: number;
}

export interface UpdateSeat {
  id: number;
  letter?: string;
  number?: number;
  isActive?: boolean;
  busId?: number;
  seatTypeId?: number;
}

export interface SearchSeat {
  letter?: string;
  number?: number;
  isActive?: boolean;
  busId?: number;
  seatTypeId?: number;
}
