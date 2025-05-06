import { apiRequest } from '../Api';
import {
  LoginInput,
  RegisterInput,
  User,
  SetPasswordInput,
  SetPasswordResponse,
  LoginResponse,
  ChangePasswordInput,
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
    url: 'user/forgot',
    data: { email },
  });

export const resetPassword = async (data: SetPasswordInput, token: string) =>
  apiRequest<SetPasswordInput, SetPasswordResponse>({
    method: 'POST',
    url: `user/reset/${token}`,
    data,
  });

export const editProfile = async (data: Partial<User>) => {
  return apiRequest<Partial<User>, User>({
    method: 'PATCH',
    url: 'user/me',
    data,
  });
};

export const changePassword = async (data: ChangePasswordInput) => {
  return apiRequest<ChangePasswordInput, User>({
    method: 'PATCH',
    url: 'users/change-password',
    data,
  });
};

export const getUserDetails = async () =>
  apiRequest<undefined, User>({ method: 'GET', url: 'user/me' });
