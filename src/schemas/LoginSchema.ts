import { object, string } from 'yup';

export const LoginSchema = object().shape({
  email: string()
    .required('Email is required!')
    .email('Please enter a valid email address'),
  password: string().required('Password is required'),
});
