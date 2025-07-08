import { object, string } from 'yup';

export const EditProfileSchema = object().shape({
  firstName: string().required('First name is required!').trim(),
  lastName: string().required('Last name is required!').trim(),
  email: string()
    .required('Email is required!')
    .email('Please enter a valid email address'),
});
