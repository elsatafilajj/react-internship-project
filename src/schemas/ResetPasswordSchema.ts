import { object, ref, string } from 'yup';

export const ResetPasswordSchema = object({
  newPassword: string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: string()
    .required('Confirm password is required')
    .oneOf([ref('newPassword')], 'Passwords must match'),
});
