import api from './api';
import type { ApiResponse, PageResponse } from '@/types/api';
import type { Location, CreateLocation, UpdateLocation, SearchLocation } from '@/types/location';

export const locationService = {
  list(page = 0, size = 20) {
    return api.get<ApiResponse<PageResponse<Location>>>('/journeys/catalog/locations', { params: { page, size } });
  },

  search(filters: SearchLocation, page = 0, size = 20) {
    return api.post<ApiResponse<PageResponse<Location>>>('/journeys/catalog/locations/search', filters, { params: { page, size } });
  },

  getById(id: number) {
    return api.get<ApiResponse<Location>>(`/journeys/catalog/locations/${id}`);
  },

  create(data: CreateLocation) {
    return api.post<ApiResponse<Location>>('/journeys/inventory/locations', data);
  },

  update(data: UpdateLocation) {
    return api.patch<ApiResponse<Location>>('/journeys/inventory/locations', data);
  },

  remove(id: number) {
    return api.delete<ApiResponse<Location>>(`/journeys/inventory/locations/${id}`);
  },
};
