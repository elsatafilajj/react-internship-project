import { object, ref, string } from 'yup';

export const RegisterSchema = object().shape({
  name: string().required('Full name is required'),
  email: string()
    .required('Email is required!')
    .email('Please enter a valid email address'),
  password: string().required('Password is required'),
  confirmPassword: string()
    .required('Confirm password is required')
    .oneOf([ref('password')], 'Passwords must match'),
});
