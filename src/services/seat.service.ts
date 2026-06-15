import api from './api';
import type { ApiResponse, PageResponse } from '@/types/api';
import type { SeatFull, CreateSeat, UpdateSeat, SearchSeat } from '@/types/seat';

export const seatService = {
  list(page = 0, size = 20) {
    return api.get<ApiResponse<PageResponse<SeatFull>>>('/fleet/availability/seats', { params: { page, size } });
  },

  search(filters: SearchSeat, page = 0, size = 20) {
    return api.post<ApiResponse<PageResponse<SeatFull>>>('/fleet/availability/seats/search', filters, { params: { page, size } });
  },

  getById(id: number) {
    return api.get<ApiResponse<SeatFull>>(`/fleet/availability/seats/${id}`);
  },

  create(data: CreateSeat) {
    return api.post<ApiResponse<SeatFull>>('/fleet/architect/seats', data);
  },

  update(data: UpdateSeat) {
    return api.patch<ApiResponse<SeatFull>>('/fleet/architect/seats', data);
  },

  remove(id: number) {
    return api.delete<ApiResponse<SeatFull>>(`/fleet/architect/seats/${id}`);
  },
};
