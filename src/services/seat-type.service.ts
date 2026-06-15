import api from './api';
import type { ApiResponse, PageResponse } from '@/types/api';
import type { SeatType, CreateSeatType, UpdateSeatType, SearchSeatType } from '@/types/seat-type';

export const seatTypeService = {
  list(page = 0, size = 20) {
    return api.get<ApiResponse<PageResponse<SeatType>>>('/fleet/availability/seat-types', { params: { page, size } });
  },

  search(filters: SearchSeatType, page = 0, size = 20) {
    return api.post<ApiResponse<PageResponse<SeatType>>>('/fleet/availability/seat-types/search', filters, { params: { page, size } });
  },

  getById(id: number) {
    return api.get<ApiResponse<SeatType>>(`/fleet/availability/seat-types/${id}`);
  },

  create(data: CreateSeatType) {
    return api.post<ApiResponse<SeatType>>('/fleet/architect/seat-types', data);
  },

  update(data: UpdateSeatType) {
    return api.patch<ApiResponse<SeatType>>('/fleet/architect/seat-types', data);
  },

  remove(id: number) {
    return api.delete<ApiResponse<SeatType>>(`/fleet/architect/seat-types/${id}`);
  },
};
