import { object, string } from 'yup';

export const CommentSchema = object().shape({
  content: string()
    .required('Comment is required!')
    .max(100, 'Too Long')
    .trim(),
});
