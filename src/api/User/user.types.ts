export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  createdDate: Date;
  updatedDate: Date;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  employeStatus: string;
  department: string;
  invitedOn: Date;
  firstTimeInvitedOn: Date;
  active: boolean;
  invitationAcceptedOn: Date;
  role: UserRole;
  receiveNotifications: boolean;
}

export enum UserRole {
  Admin = 'Admin',
  Company = 'Company',
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

export interface SetPasswordResponse {
  message: string;
}

export interface ChangePasswordInput {
  password: string;
  passwordConfirm: string;
  oldPassword: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
