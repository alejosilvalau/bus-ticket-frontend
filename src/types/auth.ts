export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserDTO {
  id: number;
  firstName: string;
  lastName: string;
  isActive: boolean;
  email: string;
  isAdmin: boolean;
}

export interface LoginResponse {
  token: string;
  user: UserDTO;
}

export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UpdateUser {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ChangePassword {
  email: string;
  password: string;
  newPassword: string;
}
