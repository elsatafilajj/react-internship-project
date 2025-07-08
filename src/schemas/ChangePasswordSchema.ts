import { object, ref, string } from 'yup';

export const ChangePasswordSchema = object({
  oldPassword: string().trim().required('Old password is required'),
  newPassword: string()
    .trim()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  newPasswordConfirm: string()
    .trim()
    .required('Confirm password is required')
    .oneOf([ref('newPassword')], 'Passwords must match'),
});
