import { object, string } from 'yup';

export const AddEditAlertTypeSchema = object().shape({
  name: string().required('Name is required'),
  description: string().required('Description is required'),
  logo: string().required('Logo is required'),
  color: string().required('Color is required'),
});
