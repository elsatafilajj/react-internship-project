import { object, string } from 'yup';

export const VerifyEmailSchema = object().shape({
  code: string()
    .matches(/^\d+$/, 'Verification code must contain only numbers')
    .min(6, 'Verification code must be 6 digits')
    .max(6, 'Verification code must be 6 digits')
    .required('Verification code is required')
    .trim(),
});
