import { apiRequest } from '../Api';
import {
  LoginInput,
  RegisterInput,
  User,
  SetPasswordInput,
  SetPasswordResponse,
  LoginResponse,
  ChangePasswordInput,
  RefreshTokenPayload,
  RefreshTokenResponse,
} from './user.types';

export const login = async (data: LoginInput) =>
  apiRequest<LoginInput, LoginResponse>({
    method: 'POST',
    url: 'auth/login',
    data,
  });

export const register = async (data: RegisterInput) =>
  apiRequest<RegisterInput, User>({
    method: 'POST',
    url: 'auth/register',
    data,
  });

export const logout = async () => {
  return apiRequest({
    method: 'POST',
    url: 'auth/logout',
  });
};

export const forgotPassword = async ({ email }: { email: string }) =>
  apiRequest<{ email: string }, { result: boolean }>({
    method: 'POST',
    url: 'users/forgot',
    data: { email },
  });

export const resetPassword = async (data: SetPasswordInput, token: string) =>
  apiRequest<SetPasswordInput, SetPasswordResponse>({
    method: 'POST',
    url: `users/reset/${token}`,
    data,
  });

export const editProfile = async (data: Partial<User>) => {
  return apiRequest<Partial<User>, User>({
    method: 'PATCH',
    url: 'users/me',
    data,
  });
};

export const changePassword = async (data: ChangePasswordInput) => {
  return apiRequest<ChangePasswordInput, User>({
    method: 'PATCH',
    url: 'users/me/password',
    data,
  });
};

export const refreshTokenApi = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  return apiRequest<RefreshTokenPayload, RefreshTokenResponse>({
    method: 'POST',
    url: 'auth/refresh-token',
    data: { refreshToken },
  });
};

export const getUserDetails = async () =>
  apiRequest<undefined, User>({ method: 'GET', url: 'users/me' });

export const getAllUsersInRoom = async (roomId: string) => {
  return apiRequest<undefined, User[]>({
    method: 'GET',
    url: `users/room/${roomId}`,
  });
};
