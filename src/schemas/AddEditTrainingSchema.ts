import { object, string, date } from 'yup';

export const AddEditTrainingSchema = object().shape({
  name: string().required('Name is required!'),
  address: string().required('Address is required!'),
  date: date().nullable().required('Date is required!'),
  time: string().nullable().required('Time is required!'),
  trainer: string().required('Trainer is required!'),
  status: string().required('Status is required!'),
});
