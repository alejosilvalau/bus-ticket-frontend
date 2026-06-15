import api from './api';
import type { ApiResponse, PageResponse } from '@/types/api';
import type { TripFull, CreateTrip, UpdateTrip, SearchTrip } from '@/types/trip';
import type { SeatAvailability } from '@/types/seat';

export const tripService = {
  list(page = 0, size = 20) {
    return api.get<ApiResponse<PageResponse<TripFull>>>('/journeys/catalog/trips', { params: { page, size } });
  },

  search(filters: SearchTrip, page = 0, size = 20) {
    return api.post<ApiResponse<PageResponse<TripFull>>>('/journeys/catalog/trips/search', filters, { params: { page, size } });
  },

  listAvailable(page = 0, size = 20) {
    return api.get<ApiResponse<PageResponse<TripFull>>>('/journeys/catalog/trips/available', { params: { page, size } });
  },

  searchAvailable(filters: SearchTrip, page = 0, size = 20) {
    return api.post<ApiResponse<PageResponse<TripFull>>>('/journeys/catalog/trips/available/search', filters, { params: { page, size } });
  },

  getById(id: number) {
    return api.get<ApiResponse<TripFull>>(`/journeys/catalog/trips/${id}`);
  },

  getSeats(id: number) {
    return api.get<ApiResponse<SeatAvailability[]>>(`/journeys/catalog/trips/${id}/seats`);
  },

  create(data: CreateTrip) {
    return api.post<ApiResponse<TripFull>>('/journeys/inventory/trips', data);
  },

  update(data: UpdateTrip) {
    return api.patch<ApiResponse<TripFull>>('/journeys/inventory/trips', data);
  },

  remove(id: number) {
    return api.delete<ApiResponse<TripFull>>(`/journeys/inventory/trips/${id}`);
  },
};
