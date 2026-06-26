import type { UserDTO } from './auth';
import type { Trip } from './trip';
import type { Seat } from './seat';

export interface Ticket {
  id: number;
  finalPrice: number;
  bookingTime: string;
  isCancelled: boolean;
  token: string;
}

export interface TicketFull extends Ticket {
  user: UserDTO;
  trip: Trip;
  seat: Seat;
}

export interface TicketToken {
  busPlateNumber: string;
  driverName: string;
  originCityName: string;
  destinationCityName: string;
  tripDepartureDate: string;
  tripArrivalDate: string;
  seatLetter: string;
  seatNumber: number;
  seatTypeName: string;
  bookingTime: string;
}

export interface CreateTicket {
  userId: number;
  tripId: number;
  seatId: number;
}

export interface UpdateTicket {
  id: number;
  token?: string;
  userId?: number;
  tripId?: number;
  seatId?: number;
}

export interface SearchTicket {
  startFinalPrice?: number;
  endFinalPrice?: number;
  startBookingTime?: string;
  endBookingTime?: string;
  isCancelled?: boolean;
  token?: string;
  userId?: number;
  tripId?: number;
  seatId?: number;
}

export interface FinalPriceRequest {
  tripId: number;
  seatId: number;
}
