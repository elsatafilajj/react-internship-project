import { object, string } from 'yup';

export const ForgotPasswordSchema = object().shape({
  email: string()
    .required('Email is required!')
    .email('Please enter a valid email address')
    .matches(
      /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Please enter a valid email address',
    ),
});
