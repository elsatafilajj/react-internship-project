import { object, ref, string } from 'yup';

export const RegisterSchema = object().shape({
  firstName: string().required('First name is required'),
  lastName: string().required('Last name is required'),
  email: string()
    .required('Email is required!')
    .email('Please enter a valid email address'),
  password: string().required('Password is required'),
  passwordConfirm: string()
    .required('Confirm password is required')
    .oneOf([ref('password')], 'Passwords must match'),
});
