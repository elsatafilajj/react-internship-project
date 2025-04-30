import { object, string } from 'yup';

export const AddEditBranchSchema = object().shape({
  name: string().required('Name is required!'),
  state: string().required('State is required!'),
  city: string().required('City is required!'),
  streetName: string().required('Street Name is required!'),
  zipCode: string().required('ZIP Code is required!'),
  email: string().email('Invalid email').required('Email is required!'),
  contact: string().required('Contact is required!'),
});
