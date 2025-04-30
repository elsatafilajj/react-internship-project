import { object, string, date } from 'yup';

export const AddEditUserSchema = object().shape({
  firstName: string().required('First name is required!'),
  lastName: string().required('Last name is required!'),
  email: string()
    .required('Email is required!')
    .email('Please enter a valid email address'),
  mobile: string()
    .required('Mobile is required!')
    .matches(/^[0-9]+$/, 'Mobile number must be digits only'),
  dateOfBirth: date().nullable().required('Date of birth is required!'),
  department: string().required('Department is required!'),
  status: string().required('Status is required!'),
});
