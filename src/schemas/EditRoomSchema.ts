import { object, string } from 'yup';

export const EditRoomSchema = object().shape({
  title: string().min(4, 'Too short!').max(20, 'Too long!'),
});
