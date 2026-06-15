import api from './api';
import type { ApiResponse } from '@/types/api';
import type { LoginRequest, LoginResponse, CreateUser, UserDTO, ChangePassword } from '@/types/auth';

export const authService = {
  login(data: LoginRequest) {
    return api.post<ApiResponse<LoginResponse>>('/identity/auth/login', data);
  },

  logout() {
    return api.get<ApiResponse<boolean>>('/identity/auth/logout');
  },

  register(data: CreateUser) {
    return api.post<ApiResponse<UserDTO>>('/identity/register/', data);
  },

  changePassword(data: ChangePassword) {
    return api.patch<ApiResponse<boolean>>('/identity/auth/change-password', data);
  },
};
