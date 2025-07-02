export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  uuid: string;
  createdAt: string;
  deletedAt: string;
  updatedAt: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export enum UserRole {
  Host = 'host',
  Participant = 'participant',
}

export interface LoginRegisterResponse {
  success: string;
  user: User;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SetPasswordInput {
  password: string;
  passwordConfirm: string;
}

export interface SetVerifyEmailCode {
  code: number;
}

export interface SetVerifyEmailResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface SetPasswordResponse {
  message: string;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
