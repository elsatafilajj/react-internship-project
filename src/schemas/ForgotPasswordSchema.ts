import { object, string } from 'yup';

export const ForgotPasswordSchema = object().shape({
  email: string()
    .required('Email is required!')
    .email('Please enter a valid email address'),
});
