import { object, ref, string } from 'yup';

export const ResetPasswordSchema = object({
  password: string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  passwordConfirm: string()
    .required('Confirm password is required')
    .oneOf([ref('password')], 'Passwords must match'),
});
