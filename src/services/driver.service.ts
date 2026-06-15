import api from './api';
import type { ApiResponse, PageResponse } from '@/types/api';
import type { Driver, CreateDriver, UpdateDriver, SearchDriver } from '@/types/driver';

export const driverService = {
  list(page = 0, size = 20) {
    return api.get<ApiResponse<PageResponse<Driver>>>('/identity/drivers', { params: { page, size } });
  },

  search(filters: SearchDriver, page = 0, size = 20) {
    return api.post<ApiResponse<PageResponse<Driver>>>('/identity/drivers/search', filters, { params: { page, size } });
  },

  getById(id: number) {
    return api.get<ApiResponse<Driver>>(`/identity/drivers/${id}`);
  },

  create(data: CreateDriver) {
    return api.post<ApiResponse<Driver>>('/identity/drivers', data);
  },

  update(data: UpdateDriver) {
    return api.patch<ApiResponse<Driver>>('/identity/drivers', data);
  },

  remove(id: number) {
    return api.delete<ApiResponse<Driver>>(`/identity/drivers/${id}`);
  },
};
