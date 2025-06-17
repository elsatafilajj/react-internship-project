import { object, ref, string } from 'yup';

export const RegisterSchema = object().shape({
  firstName: string().required('First name is required').trim(),
  lastName: string().required('Last name is required').trim(),
  email: string()
    .required('Email is required!')
    .email('Please enter a valid email address'),
  password: string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*\d)(?=.*[!@#$%^&*.?_-])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/,
      'Password must be at least 8 letters, must contain an uppercase letter, and a character.',
    ),
  passwordConfirm: string()
    .required('Confirm password is required')
    .oneOf([ref('password')], 'Passwords must match'),
});
