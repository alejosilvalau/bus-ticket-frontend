import type { Bus } from './bus';
import type { Driver } from './driver';
import type { Location } from './location';

export interface Trip {
  id: number;
  departureDate: string;
  arrivalDate: string;
  basePrice: number;
}

export interface TripFull extends Trip {
  bus: Bus;
  driver: Driver;
  locationOrigin: Location;
  locationDestination: Location;
}

export interface CreateTrip {
  departureDate: string;
  arrivalDate: string;
  basePrice: number;
  busId: number;
  driverId: number;
  locationOriginId: number;
  locationDestinationId: number;
}

export interface UpdateTrip {
  id: number;
  departureDate?: string;
  arrivalDate?: string;
  basePrice?: number;
  busId?: number;
  driverId?: number;
  locationOriginId?: number;
  locationDestinationId?: number;
}

export interface SearchTrip {
  departureDate?: string;
  arrivalDate?: string;
  startBasePrice?: number;
  endBasePrice?: number;
  busId?: number;
  driverId?: number;
  locationOriginId?: number;
  locationDestinationId?: number;
  seatTypeId?: number;
}
