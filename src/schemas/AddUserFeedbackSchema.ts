import { object, string } from 'yup';

export const AddUserFeedbackSchema = object().shape({
  name: string().required('Name is required!'),
  notes: string().required('Notes is required!'),
  file: string().nullable(),
});
