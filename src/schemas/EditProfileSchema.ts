import { object, string } from 'yup';

export const EditProfileSchema = object().shape({
  firstName: string().required('First name is required!'),
  lastName: string().required('Last name is required!'),
  email: string()
    .required('Email is required!')
    .email('Please enter a valid email address'),
  department: string().required('Department is required!'),
});
