// types/user.types.ts
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  active: boolean;
  provider?: string;
  phoneNumber?: string;
  lastLogin?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  active?: boolean;
  password?: string;
  phoneNumber?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  active?: boolean;
}
