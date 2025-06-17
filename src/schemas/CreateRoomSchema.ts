import { object, string } from 'yup';

export const CreateRoomSchema = object().shape({
  title: string()
    .required('Title is required!')
    .min(1, 'Room title must be at least 4 characters')
    .max(50, 'Too Long!')
    .trim(),
});
