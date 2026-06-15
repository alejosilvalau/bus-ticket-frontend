import api from './api';
import type { ApiResponse, PageResponse } from '@/types/api';
import type { Bus, CreateBus, UpdateBus, SearchBus } from '@/types/bus';

export const busService = {
  list(page = 0, size = 20) {
    return api.get<ApiResponse<PageResponse<Bus>>>('/fleet/availability/buses', { params: { page, size } });
  },

  search(filters: SearchBus, page = 0, size = 20) {
    return api.post<ApiResponse<PageResponse<Bus>>>('/fleet/availability/buses/search', filters, { params: { page, size } });
  },

  getById(id: number) {
    return api.get<ApiResponse<Bus>>(`/fleet/availability/buses/${id}`);
  },

  create(data: CreateBus) {
    return api.post<ApiResponse<Bus>>('/fleet/architect/buses', data);
  },

  update(data: UpdateBus) {
    return api.patch<ApiResponse<Bus>>('/fleet/architect/buses', data);
  },

  remove(id: number) {
    return api.delete<ApiResponse<Bus>>(`/fleet/architect/buses/${id}`);
  },
};
