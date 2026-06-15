import api from './api';
import type { ApiResponse } from '@/types/api';
import type { UserDTO, UpdateUser } from '@/types/auth';

export const profileService = {
  update(data: UpdateUser) {
    return api.patch<ApiResponse<UserDTO>>('/identity/profile/', data);
  },

  logicalDelete() {
    return api.patch<ApiResponse<UserDTO>>('/identity/profile/logical-delete');
  },

  delete() {
    return api.delete<ApiResponse<UserDTO>>('/identity/profile/');
  },
};
