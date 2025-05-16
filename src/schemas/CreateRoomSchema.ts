import { object, string } from 'yup';

export const CreateRoomSchema = object().shape({
  title: string()
    .required('Title is required!')
    .min(4, 'Room title must be at least 4 characters')
    .max(20, 'Too Long!'),
});
